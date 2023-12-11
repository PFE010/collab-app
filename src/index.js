const Utils = require('../src/helper');
const initializeApi = require('./services/api');

module.exports = async (app) => {
  require('dotenv').config();
  require('../src/helper');

  const { DatabaseFunctions } = require('./services/db_functions');
  const db_functions = new DatabaseFunctions();
  const utils = new Utils(db_functions);

  // Initialize the API
  const api = await initializeApi();

  /*
  utils.initBadges();
  utils.initPaliers();
  utils.initUserBadges();
  utils.initBadgePalier();
  */

  function logEvent(context) {
    const { action, repository, pull_request, assignee} = context.payload;

    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, PR time updated: ${pull_request.updated_at}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Assigner : ${pull_request.user.login}, user_id: ${pull_request.user.id}\n
    Assignee : ${pull_request.assignee?.login || null}, user_id: ${pull_request.assignee?.id}`);
  }

  async function fetchPRDetails(url) {
    const parsedUrl = new URL(url);

    // Extracting repository owner, repo name, and pull request number
    const pathParts = parsedUrl.pathname.split('/');
    const owner = pathParts[2];
    const repo = pathParts[3];
    const prNumber = pathParts[5];

      // Fetch pr
      try {
        // Use the API instance
        const response = await api.fetchPRDetails(owner, repo, prNumber); 
        return response;       
      } catch (error) {
          console.error('Error:', error);
      }
  } 

  function printPoints(assignee) {
    db_functions.fetchUserWithCallback(assignee.login, (data) => {
      console.log("----------");
      console.log("User: " + data[0].nom + " now has: " + data[0].points + " points.");
    });
  } 

  function addPRToBdIfNull(pull_request, callback) {
    db_functions.fetchPrWithCallback(pull_request.id, (data) => {
      if(data === undefined || data.length == 0) {
        console.log("hi")
        db_functions.addPR(pull_request.id, pull_request.url, pull_request.body, pull_request.title, utils.convertDate(pull_request.created_at), null, null, pull_request.state, null);
      }

      callback();
    })
  }

  // Pull request open -- works
  app.on('pull_request.opened', async (context) => {

    const { action, repository, pull_request} = context.payload;
  
    // Check if the pull request has a description
    if (pull_request.body) {
      app.log.info(`PR description: ${pull_request.body} \n`);
    } else {
      app.log.info("PR has no description, please add one \n");
    }

    db_functions.addPR(pull_request.id, pull_request.url, pull_request.body, pull_request.title, utils.convertDate(pull_request.created_at), null, null, pull_request.state, null);
    db_functions.addPoints(pull_request.user.id, 2);
    printPoints(assignee);
  });
  
  //PR is being labeled --- works
  app.on('pull_request.labeled', async (context) => {
    const { action, repository, pull_request, label} = context.payload;
    addPRToBdIfNull(pull_request);

    let count;

    db_functions.fetchPrWithPromise(pull_request.id).then(data => {
      labels = utils.labelStringToList(data[0].labels);
      count = utils.countLabels(data[0].labels);
      count += 1;

      if(labels?.length > 0) {
        labels.push(label.name);
        console.log("push", labels)
      } else {
        labels = [label.name]
        console.log("empty", labels)
      }
      db_functions.editPRField(pull_request.id, 'labels', utils.fromArrayToLabelString(labels), utils.convertDate(pull_request.updated_at));

      if(count == 1) {
        console.log("count", count)
        console.log("label", label)

        assignee = pull_request.assignee || pull_request.assignees[0];
        if(assignee) {
          db_functions.addPoints(assignee.id, 2);
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
  

    db_functions.fetchPrWithPromise(pull_request.id).then(data => {
      labels = utils.labelStringToList(data[0].labels);
      count = utils.countLabels(data[0].labels);
      count -= 1;
      console.log("labels", labels)
      console.log("label", label)

      if(labels?.length > 0) {
        labels.filter(item => item !== label.name);
        console.log("remove", labels)
      }
      db_functions.editPRField(pull_request.id, 'labels', utils.fromArrayToLabelString(labels), utils.convertDate(pull_request.updated_at)); 
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

  //PR assign -- works
  app.on('pull_request.assigned', (context) => {
    const { action, repository, pull_request, assignee} = context.payload;
    addPRToBdIfNull(pull_request, () => {
      const user = pull_request.user;
      // Create assigned user if needed  
      db_functions.addUserIfNullWithCallback(user.id, user.login, 0, () => {
        db_functions.addUserIfNullWithCallback(assignee.id, assignee.login, 0, () => {
          db_functions.addPullRequestUser(assignee.id, pull_request.id, 'a');
        
          // Add 2 points to person who created the PR
          db_functions.addPoints(pull_request.user.id, 2);
          printPoints(pull_request.user);
        });
      });
    });
  });

  //PR unassign -- works
  app.on('pull_request.unassigned', (context) => {
    const { action, repository, pull_request, assignee} = context.payload;
    addPRToBdIfNull(pull_request, () => {
      // Create assigned user if needed
      const user = pull_request.user;
  
      db_functions.addUserIfNullWithCallback(user.id, user.login, 0, () => {
        db_functions.addUserIfNullWithCallback(assignee.id, assignee.login, 0, () => {
          db_functions.removePullRequestUser(assignee.id, pull_request.id, 'a');

          // Add 2 points to person who created the PR
          db_functions.addPoints(pull_request.user.id, 2);
          printPoints(pull_request.user);
        });
      }) 
    });
  });
  

  //PR is edited when the description is added or edited --works
  app.on('pull_request.edited', (context) => {
    const { action, repository, pull_request, changes} = context.payload;
    addPRToBdIfNull(pull_request, () => {

      // Check if the pull request has a description
      if (pull_request.body) {
        app.log.info(`PR description was added: ${pull_request.body} \n`);
      }
      db_functions.editPRField(pull_request.id, 'description', pull_request.body, utils.convertDate(pull_request.updated_at));
    });
  });

  //Reopening a PR -- works
  app.on('pull_request.reopened', (context) => {
    const { action, repository, pull_request} = context.payload;
    addPRToBdIfNull(pull_request, () => {
      db_functions.editPRField(pull_request.id, 'status', pull_request.state, utils.convertDate(pull_request.updated_at));
    });
  });

  //PR closed -- works
  app.on('pull_request.closed', (context) => {
    const { action, repository, pull_request } = context.payload;
    addPRToBdIfNull(pull_request, () => {
      console.log(pull_request.state)
      db_functions.editPRField(pull_request.id, 'status', pull_request.state, utils.convertDate(pull_request.updated_at));
  
      // Check if the pull request is merged
      if (pull_request.merged) {
        db_functions.editPRField(pull_request.id, 'date_merge',  utils.convertDate(pull_request.merged_at), utils.convertDate(pull_request.updated_at));
        db_functions.addPoints(pull_request.assignee.id, 4);
        utils.updateProgression('merge', pull_request.assignee.id, 1);
      }
    });
  }); 

  //PR reviewer is added
  app.on('pull_request.review_requested', (context) => {
    const { action, repository, pull_request, requested_reviewer} = context.payload;
    addPRToBdIfNull(pull_request, () => {
      console.log("pr", pull_request);
      const { id, login } = requested_reviewer;
      db_functions.addUserIfNullWithCallback(id, login, 0, () => {
        db_functions.addPullRequestUser(id, pull_request.id, 'r');
      });
    });
  });

   //PR reviewer is unadded
   app.on('pull_request.review_request_removed', (context) => {
    const { action, repository, pull_request, requested_reviewer} = context.payload;
  });



  //Commit on a PR -- works (event triggered when a new commit is added to a PR)
  app.on('pull_request.synchronize', context => {
    const { action, repository, pull_request, sender} = context.payload;
  
    if (pull_request.body) {
      app.log.info(`PR description: ${pull_request.body} \n`);
    }

    if(sender.id != pull_request.user.id){
      app.log.info(`There was a suggestion of code done by: ${sender.login} on the PR which belongs to ${pull_request.user.login} \n`);
    }

  });

  //PR is being commented on
  app.on('issue_comment.created', (context) => {
    const { action, repository, issue, comment} = context.payload;
    if(issue.pull_request) {
      const { pull_request } = issue;
      const assignee = pull_request || null;
      fetchPRDetails(pull_request.url).then((prDetails) => {
        const properPR = prDetails.data;
        addPRToBdIfNull(properPR, () => {
          if(assignee && assignee != comment.user) {
            console.log(assignee, comment.user);
            db_functions.addPoints(comment.user.id, 1);
            utils.updateProgression('comment', comment.user.id, 1);
          }
        }) 
      })
    }
  });

  //PR comment is being edited
  app.on('issue_comment.edited', (context) => {
    const { action, repository,issue, comment} = context.payload;
 

  });

  //PR comment is being deleted
  app.on('issue_comment.deleted', (context) => {
    const { action, repository,issue, comment} = context.payload;
  


  });

  // Existing comment on a PR is edited
  app.on('pull_request_review.edited', (context) => {
    const { action, repository, pull_request, review} = context.payload;
  
 

    if (pull_request.body) {
      app.log.info(`PR description: ${pull_request.body} \n`);
    }

  });

  //Comment submitted on a commit for review or when changes are requested or when approuved
  app.on('pull_request_review.submitted', async (context) => {

    const { action, repository, pull_request, review} = context.payload;


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
  


  });

  //Comment on the code being edited
  app.on('pull_request_review_comment.edited', async (context) => {

    const { action, repository, pull_request, comment, sender} = context.payload;

  });

  //Comment on the code being deleted
  app.on('pull_request_review_comment.deleted', async (context) => {
    const { action, repository, pull_request, comment, sender} = context.payload;
  


  });

  //PR has a thread that is resolved
  app.on('pull_request_review_thread.resolved', async (context) => {
    const { action, repository, pull_request, sender, thread } = context.payload;
    addPRToBdIfNull(pull_request, () => {
      console.log("pull")
      console.log("reactions", thread.comments[0].reactions['+1']);
  
  
      // pour chaque comment on check le role du user sur le comment 
      thread.comments.forEach(comment => {
        
        if(comment.user.login) {
          db_functions.fetchPullRequestUserWithCallback(pull_request.id, comment.user.id, (data) => {
            if(data[0].role = 'r'){
              const reactor_increment = comment.reactions['+1'] - comment.reactions['-1'];
              db_functions.addPoints(comment.user.id, reactor_increment);
              utils.updateProgression('react', comment.user.id, reactor_increment);
            }
          })
        }
      })
    });
  });

  //test hook, use [ node_modules/.bin/probot receive -e issues -p test/fixtures/issues.opened.json ./index.js ] in command line to enter
  app.on('issues.opened', async (context) => {
    db_functions.getfulltable('pull_request');
    db_functions.getfulltable('utilisateur');
    db_functions.getfulltable('badge');
  });
}
