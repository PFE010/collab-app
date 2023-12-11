const initializeApi = require('./services/api');

module.exports = async (app) => {
  require('dotenv').config();

  const helper = require('../src/helper');
  const { DatabaseFunctions } = require('./services/db_functions');
  const db_functions = new DatabaseFunctions();
  const dummyData = require('./assets/dummyData');

   // for testing only
  function initPaliers() {
    dummyData.palierData.forEach(item => {
      const { points_attrib, titre_palier, nb_action_requise, image } = item;
      db_functions.createPaliers(points_attrib, titre_palier, nb_action_requise, image)
    })
  }

  // for testing only
  function initBadges() {
    dummyData.badgesData.forEach(badge => {
      const { titre, description, action } = badge;
      db_functions.createBadges(titre, description, action)
    });
  }

  // for testing only
  function initUserBadges() {
    db_functions.getfulltableWithCallback('utilisateur', (data) => {
      data.forEach(user => {
        const id_user = user.id_utilisateur;

        db_functions.getfulltableWithCallback('badge', (badges) => {
          badges.forEach(badge => {
            const { id_badge } = badge;
            db_functions.addUserBadge(id_user, id_badge, 0, 1);
          });
        })
      })
    })
  }

  // for testing only
  function initBadgePalier() {
    db_functions.getfulltableWithCallback('badge', (badges) => {
      badges.forEach(badge => {
        console.log("badge", badge)
        const paliersBadge = dummyData.palierData.filter(palier => palier.titre_palier.includes(badge.titre))
        console.log("paliers", paliersBadge)
        paliersBadge.forEach(palier => {
          db_functions.getPalierWithCallback(palier.titre_palier, (data) => {
            db_functions.addBadgePaliers(badge.id_badge, data[0].id_palier);
          })
        })
      })
    })
  } 



  // Initialize the API
  const api = await initializeApi();

  // initBadges();

  // initPaliers();

  // initUserBadges();

  // initBadgePalier();


  function logEvent(context) {
    const { action, repository, pull_request, assignee} = context.payload;

    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, PR time updated: ${pull_request.updated_at}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Assigner : ${pull_request.user.login}, user_id: ${pull_request.user.id}\n
    Assignee : ${pull_request.assignee?.login || null}, user_id: ${pull_request.assignee?.id}`);
  }

  async function fetchPRDetails(context) {
    const { repository, pull_request} = context.payload;
      // Fetch pr
      try {
        // Use the API instance
        const response = await api.fetchPRDetails(repository.owner.login, repository.name, pull_request.number); 
        return response;       
      } catch (error) {
          console.error('Error:', error);
      }
  } 

  function userAddPoints(login, id, points){
     //check if the user exists in the db
     db_functions.fetchUserWithCallback(login, (data) => {
      console.log("----------");
      console.log(data);
      
      //if user exists then remove points to him otherwise create user with the 0 points
      if (Array.isArray(data) && data.length > 0) {
            console.log(`User ${login} exists in the database.`);
            db_functions.addPoints(points, login);
        } else {
            console.log(`User ${login} does not exist in the database.`);
            db_functions.addUserIfNull(id, login, points);
        }
    });
  }

  function userRemovePoints(login, id, points){
    //check if the user exists in the db
    db_functions.fetchUserWithCallback(login, (data) => {
     console.log("----------");
     console.log(data);
     
     //if user exists then remove points to him otherwise create user with the 0 points
     if (Array.isArray(data) && data.length > 0) {
           console.log(`User ${login} exists in the database.`);
           db_functions.removePoints(points, login);
       } else {
           console.log(`User ${login} does not exist in the database.`);
           db_functions.addUserIfNull(id, login, 0);
       }
   });
 }

  function printPoints(assignee) {
    db_functions.fetchUserWithCallback(assignee.login, (data) => {
      console.log("----------");
      console.log("User: " + data[0].username + " now has: " + data[0].points + " points.");
    });
  } 

  function addPRToBdIfNull(pull_request) {
    db_functions.fetchPrWithCallback(pull_request.number, (data) => {
      if(data === undefined || data.length == 0) {
        db_functions.addPR(pull_request.number, pull_request.url, pull_request.body, pull_request.title, helper.convertDate(pull_request.created_at), null, null, pull_request.state, null);
      }
    })
  }

  // Pull request open -- points works
  app.on('pull_request.opened', async (context) => {

    const { action, repository, pull_request} = context.payload;
  
    logEvent(context);

    // Check if the pull request has a description
    if (pull_request.body) {
      app.log.info(`PR description: ${pull_request.body} \n`);
    } else {
      app.log.info("PR has no description, please add one \n");
    }

    db_functions.addPR(pull_request.number, pull_request.url, pull_request.body, pull_request.title, helper.convertDate(pull_request.created_at), null, null, pull_request.state, null);
    userAddPoints(pull_request.user.login, pull_request.user.id, 2);
    //printPoints(pull_request.user);
  });
  
  //PR is being labeled --- works
  app.on('pull_request.labeled', async (context) => {
    const { action, repository, pull_request, label} = context.payload;
    addPRToBdIfNull(pull_request);

    let count;
    logEvent(context);

    db_functions.fetchPrWithPromise(pull_request.number).then(data => {
      labels = helper.labelStringToList(data[0].labels);
      count = helper.countLabels(data[0].labels);
      count += 1;

      if(labels?.length > 0) {
        labels.push(label.name);
        console.log("push", labels)
      } else {
        labels = [label.name]
        console.log("empty", labels)
      }
      db_functions.editPRField(pull_request.number, 'labels', helper.fromArrayToLabelString(labels), helper.convertDate(pull_request.updated_at));

      if(count == 1) {
        console.log("count", count)
        console.log("label", label)

        assignee = pull_request.assignee || pull_request.assignees[0];
        if(assignee) {
          db_functions.addPoints(2, assignee.login);
          printPoints(assignee);
        }
      }
    })
    .catch(error => {
      console.error('Error fetching pull request:', error);
    });
  });

  //PR is being unlabeled --- works
  app.on('pull_request.unlabeled', async (context) => {
    const { action, repository, pull_request, label} = context.payload;
    addPRToBdIfNull(pull_request);
  

    db_functions.fetchPrWithPromise(pull_request.number).then(data => {
      labels = helper.labelStringToList(data[0].labels);
      count = helper.countLabels(data[0].labels);
      count -= 1;
      console.log("labels", labels)
      console.log("label", label)

      if(labels?.length > 0) {
        labels.filter(item => item !== label.name);
        console.log("remove", labels)
      }
      db_functions.editPRField(pull_request.number, 'labels', helper.fromArrayToLabelString(labels), helper.convertDate(pull_request.updated_at)); 
      if(count == 0) {
        assignee = pull_request.assignee || pull_request.assignees[0];
        if(assignee) {
          console.log("else remove points")
          db_functions.removePoints(2, assignee.login);
          printPoints(assignee);
        }
      }
    });
  });

  //PR assign -- works -- points work
  app.on('pull_request.assigned', (context) => {

    const { action, repository, pull_request, assignee} = context.payload;
    addPRToBdIfNull(pull_request);

    logEvent(context);

    //check if the user exists in the db
    db_functions.fetchUserWithCallback(pull_request.assignee.login, (data) => {
      console.log("----------");
      console.log(data);
      
      //if user exists then add points to him otherwise create user with the associated points
      if (Array.isArray(data) && data.length > 0) {
            console.log(`User ${pull_request.assignee.login} exists in the database.`);
            db_functions.addPoints(2, pull_request.assignee.login);
        } else {
            console.log(`User ${pull_request.assignee.login} does not exist in the database.`);
            db_functions.addUserIfNull(pull_request.assignee.id, pull_request.assignee.login, 2);
        }
    
    });
    //doesnt update right away
    //printPoints(assignee);
  });

  //PR unassign -- works -- points work
  app.on('pull_request.unassigned', (context) => {

    const { action, repository, pull_request, assignee} = context.payload;
    addPRToBdIfNull(pull_request);

    logEvent(context);

    //check if the user exists in the db
    db_functions.fetchUserWithCallback(assignee.login, (data) => {
      console.log("----------");
      console.log(data);
      
      //if user exists then remove points to him otherwise create user with the 0 points
      if (Array.isArray(data) && data.length > 0) {
            console.log(`User ${assignee.login} exists in the database.`);
            db_functions.removePoints(2, assignee.login);
        } else {
            console.log(`User ${assignee.login} does not exist in the database.`);
            db_functions.addUserIfNull(assignee.id, assignee.login, 0);
        }
    });

    //printPoints(assignee);
  });
  

  //PR is edited when the description is added or edited --works
  app.on('pull_request.edited', (context) => {
    const { action, repository, pull_request, changes} = context.payload;
    addPRToBdIfNull(pull_request);

    // Check if the pull request has a description
    if (pull_request.body) {
      app.log.info(`PR description was added: ${pull_request.body} \n`);
    }
    db_functions.editPRField(pull_request.number, 'description', pull_request.body, helper.convertDate(pull_request.updated_at));
  });

  //Reopening a PR -- works
  app.on('pull_request.reopened', (context) => {
    const { action, repository, pull_request} = context.payload;
    addPRToBdIfNull(pull_request);

    db_functions.editPRField(pull_request.number, 'status', pull_request.state, helper.convertDate(pull_request.updated_at));
  });

  //PR closed -- works-- points only when merged -- points work
  app.on('pull_request.closed', (context) => {
    const { action, repository, pull_request } = context.payload;
    addPRToBdIfNull(pull_request);

    console.log(pull_request.state)
    db_functions.editPRField(pull_request.number, 'status', pull_request.state, helper.convertDate(pull_request.updated_at));

    // Check if the pull request is merged
    if (pull_request.merged) {
      db_functions.editPRField(pull_request.number, 'date_merge',  helper.convertDate(pull_request.merged_at), helper.convertDate(pull_request.updated_at));

      //check if the user exists in the db
      db_functions.fetchUserWithCallback(pull_request.merged_by.login, (data) => {
      console.log("----------");
      console.log(data);
      
      //if user exists then remove points to him otherwise create user with the 0 points
      if (Array.isArray(data) && data.length > 0) {
            console.log(`User ${pull_request.merged_by.login} exists in the database.`);
            db_functions.addPoints(2, pull_request.merged_by.login);
        } else {
            console.log(`User ${pull_request.merged_by.login} does not exist in the database.`);
            db_functions.addUserIfNull(pull_request.merged_by.id, pull_request.merged_by.login, 2);
        }
    });

      printPoints(pull_request.merged_by);
    }
  }); 

  //PR reviewer is added
  app.on('pull_request.review_requested', (context) => {
    const { action, repository, pull_request, requested_reviewer} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},\n
    PR time updated: ${pull_request.updated_at}, PR url: ${pull_request.url}, PR status: ${pull_request.state},\n
    Reviewer requested name: ${requested_reviewer.login}, Reviewer requested id: ${requested_reviewer.id}
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    PR creator: ${pull_request.user.login}, user_id: ${pull_request.user.id}\n`);

    userAddPoints(requested_reviewer.login, requested_reviewer.id, 1);
    printPoints(requested_reviewer);

  });

   //PR reviewer is unadded
   app.on('pull_request.review_request_removed', (context) => {
    const { action, repository, pull_request, requested_reviewer} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},\n
    PR time updated: ${pull_request.updated_at}, PR url: ${pull_request.url}, PR status: ${pull_request.state},\n
    Removed reviewer requested name: ${requested_reviewer.login}, Removed reviewer requested id: ${requested_reviewer.id}
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    PR creator: ${pull_request.user.login}, user_id: ${pull_request.user.id}\n`);

    userRemovePoints(requested_reviewer.login, requested_reviewer.id, 1);
    //printPoints(requested_reviewer);

  });



  //Commit on a PR -- works (event triggered when a new commit is added to a PR)
  app.on('pull_request.synchronize', context => {
    const { action, repository, pull_request, sender} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, PR time updated: ${pull_request.updated_at},
    Nbr of commits: ${pull_request.commits}, PR title: ${pull_request.title}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Commit done by : ${sender.login}, user_id: ${sender.id}\n`);

    

    if(sender.id != pull_request.user.id){
      app.log.info(`There was a suggestion of code done by: ${sender.login} on the PR which belongs to ${pull_request.user.login} \n`);
    }

  });

  //PR is being commented on
  app.on('issue_comment.created', (context) => {
    const { action, repository,issue, comment} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    Issue number: #${issue.number}, Issue id: ${issue.id}, PR url: ${issue.pull_request.url},\n
    Comment id: ${comment.id}, comment total reactions: ${comment.reactions.total_count},\n
    Comment created at: ${comment.created_at}, Comment updated at: ${comment.updated_at},\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name}, \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n`);

    db_functions.fetchUserWithCallback(comment.user.login, (data) => {
      console.log("----------");
      
      if (data) {
            console.log(`User ${comment.user.login} exists in the database.`);
        } else {
            console.log(`User ${comment.user.login} does not exist in the database.`);
            db_functions.addUserIfNull(comment.user.id, comment.user.login, 1);
        }
      
    });

  });

  //PR comment is being edited
  app.on('issue_comment.edited', (context) => {
    const { action, repository,issue, comment} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    Issue number: #${issue.number}, Issue id: ${issue.id}, PR url: ${issue.pull_request.url},\n
    Comment id: ${comment.id}, comment total reactions: ${comment.reactions.total_count},\n
    Comment created at: ${comment.created_at}, Comment updated at: ${comment.updated_at},\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name}, \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n`);

  });

  //PR comment is being deleted
  app.on('issue_comment.deleted', (context) => {
    const { action, repository,issue, comment} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    Issue number: #${issue.number}, Issue id: ${issue.id}, PR url: ${issue.pull_request.url},\n
    Comment id: ${comment.id}, comment total reactions: ${comment.reactions.total_count},\n
    Comment created at: ${comment.created_at}, Comment updated at: ${comment.updated_at},\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name}, \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n`);

  });

  // Existing comment on a PR is edited
  app.on('pull_request_review.edited', (context) => {
    const { action, repository, pull_request, review} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    Review id: #${review.id}, review state: ${review.state}, commit id: ${review.commit_id},\n
    Review submitted at: ${review.submitted_at}, PR id: ${pull_request.id}
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Comment made by : ${review.user.login}, user_id: ${review.user.id}\n`);

    if (pull_request.body) {
      app.log.info(`PR description: ${pull_request.body} \n`);
    }

  });

  //Comment submitted on a commit for review or when changes are requested or when approuved
  app.on('pull_request_review.submitted', async (context) => {

    const { action, repository, pull_request, review} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    Review id: #${review.id}, review state: ${review.state}, commit id: ${review.commit_id},\n
    Review submitted at: ${review.submitted_at}, PR id: ${pull_request.id}
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Comment made by : ${review.user.login}, user_id: ${review.user.id}\n`);

    if (pull_request.body) {
      app.log.info(`PR description: ${pull_request.body} \n`);
    }

    if(review.state === "changes_requested"){
      app.log.info(`Changes have been requested by ${review.user.login} on ${pull_request.user.login}'s PR`);
    }

    if(review.state === "approved"){
      app.log.info(`PR has been approved by ${review.user.login} of ${pull_request.user.login}`);
    }

  });

  //Commenting directly on the code,then finishing review
  app.on('pull_request_review_comment.created', async (context) => {
    const { action, repository, pull_request, comment} = context.payload;
    addPRToBdIfNull(pull_request);
  
    app.log.info(`Action done: ${action}\n 
    PR id: #${pull_request.id}, Comment id: ${comment.id}, Commit id: ${comment.commit_id}, PR request id:${comment.pull_request_review_id}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n`);

    //points are given to the commenter
    db_functions.fetchUserWithCallback(comment.user.login, (data) => {
      console.log("----------");
      
      if (!Array.isArray(data)) {
            console.log(`User ${comment.user.login} exists in the database.`);
            db_functions.addPoints(1, comment.user.id);
        } else {
            console.log(`User ${comment.user.login} does not exist in the database.`);
            db_functions.addUserIfNull(comment.user.id, comment.user.login, 1);
        }
      
    });

  });

  //Comment on the code being edited
  app.on('pull_request_review_comment.edited', async (context) => {

    const { action, repository, pull_request, comment, sender} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR id: #${pull_request.id}, Comment id: ${comment.id}, Commit id: ${comment.commit_id}, PR request id:${comment.pull_request_review_id}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n
    Edited by: ${sender.login}`);
  });

  //Comment on the code being deleted
  app.on('pull_request_review_comment.deleted', async (context) => {
    const { action, repository, pull_request, comment, sender} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR id: #${pull_request.id}, Comment id: ${comment.id}, Commit id: ${comment.commit_id}, PR request id:${comment.pull_request_review_id}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n
    Deleted by: ${sender.login}`);

  });

  //PR has a thread that is resolved
  app.on('pull_request_review_thread.resolved', async (context) => {
    const { action, repository, pull_request, sender} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR id: #${pull_request.id}, \n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Resolved by : ${sender.login}, user_id: ${sender.id}\n`);
  });

  //test hook, use [ node_modules/.bin/probot receive -e issues -p test/fixtures/issues.opened.json ./index.js ] in command line to enter
  app.on('issues.opened', async (context) => {
    db_functions.getfulltable('pull_request');
    db_functions.getfulltable('utilisateur');
    db_functions.getfulltable('badge');
  });
}
