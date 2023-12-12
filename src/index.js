

module.exports = (app) => {
  require('dotenv').config();
  const Utils = require('../src/helper');
  const { DatabaseFunctions } = require('./services/db_functions');
  const db_functions = new DatabaseFunctions();
  const utils = new Utils(db_functions);

  if (process.env.NODE_ENV !== 'test') {
    utils.initApi();
  }
  // utils.initDB();

  // Pull request open -- DONE
  app.on('pull_request.opened', async (context) => {
    const { action, repository, pull_request, sender} = context.payload;
    const { id, login } = sender;

    utils.addPRToBdIfNull(pull_request, () => {
      db_functions.addUserIfNullWithCallback(id, login, 0, () => {    
        // Add 2 points to person who created the PR
        db_functions.addPoints(1, id);
      });
    });
  });
  
  //PR is being labeled --- works
  app.on('pull_request.labeled', async (context) => {
    const { action, repository, pull_request, label} = context.payload;
    utils.addPRToBdIfNull(pull_request);

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
          db_functions.addPoints(2, assignee.id);
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
    utils.addPRToBdIfNull(pull_request);
  

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
          db_functions.removePoints(2, assignee.id);
        }
      }
    });
  });

  //PR assign -- works -- DONE
  app.on('pull_request.assigned', (context) => {
    const { action, repository, pull_request, assignee} = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      const user = pull_request.user;
      // Create assigned user if needed  
      db_functions.addUserIfNullWithCallback(user.id, user.login, 0, () => {
        db_functions.addUserIfNullWithCallback(assignee.id, assignee.login, 0, () => {
          db_functions.addPullRequestUser(assignee.id, pull_request.id, 'a');
        
          // Add 2 points to person who created the PR
          db_functions.addPoints(2, pull_request.user.id);
        });
      });
    });
  });

  //PR unassign -- works -- DONE
  app.on('pull_request.unassigned', (context) => {
    const { action, repository, pull_request, assignee} = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      // Create assigned user if needed
      const user = pull_request.user;
  
      db_functions.addUserIfNullWithCallback(user.id, user.login, 0, () => {
        db_functions.addUserIfNullWithCallback(assignee.id, assignee.login, 0, () => {
          db_functions.removePullRequestUser(assignee.id, pull_request.id, 'a');

          // Add 2 points to person who created the PR
          db_functions.removePoints(2, pull_request.user.id);
        });
      }) 
    });
  });
  

  //PR is edited when the description is added or edited -- DONE
  app.on('pull_request.edited', (context) => {
    const { action, repository, pull_request, changes, sender} = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      // Check if the pull request has a description
      if (pull_request.body) {
        db_functions.editPRField(pull_request.id, 'description', pull_request.body, utils.convertDate(pull_request.updated_at));
  
        const { id, login } = sender;
        db_functions.addUserIfNullWithCallback(id, login, 0, () => {
          db_functions.addPoints(1, id);
          utils.updateProgression('comment', id, 1);
        });
      }
    });
  });

  //Reopening a PR -- DONE
  app.on('pull_request.reopened', (context) => {
    const { action, repository, pull_request} = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      db_functions.editPRField(pull_request.id, 'status', pull_request.state, utils.convertDate(pull_request.updated_at));
    });
  });

  //PR closed  points only when merged 
  app.on('pull_request.closed', (context) => {
    const { action, repository, pull_request } = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      db_functions.editPRField(pull_request.id, 'status', pull_request.state, utils.convertDate(pull_request.updated_at));
      db_functions.addUserIfNullWithCallback(pull_request.assignee.id, pull_request.assignee.login, 0, () => {
        // Check if the pull request is merged
        if (pull_request.merged) {
          // add points for merge
          db_functions.editPRField(pull_request.id, 'date_merge',  utils.convertDate(pull_request.merged_at), utils.convertDate(pull_request.updated_at));
          db_functions.addPoints(4, pull_request.assignee.id);
          utils.updateProgression('merge', pull_request.assignee.id, 1);

          // add points for commits / additions
          const points = Math.floor(pull_request.additions / 10);
          db_functions.addPoints(points, pull_request.assignee.id);
          utils.updateProgression('commit', pull_request.assignee.id, points);
        }
      });
    }); 
  }); 

  //PR reviewer is added -- DONE
  app.on('pull_request.review_requested', (context) => {
    const { action, repository, pull_request, requested_reviewer} = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      console.log("pr", pull_request);
      const { id, login } = requested_reviewer;
      db_functions.addUserIfNullWithCallback(id, login, 0, () => {
        db_functions.addPullRequestUser(id, pull_request.id, 'r');
        db_functions.addPoints(1, requested_reviewer.id);
      });
    });
  });

   //PR reviewer is unadded -- DONE
  app.on('pull_request.review_request_removed', (context) => {
    const { action, repository, pull_request, requested_reviewer} = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      console.log("pr", pull_request);
      const { id, login } = requested_reviewer;
      db_functions.addUserIfNullWithCallback(id, login, 0, () => {
        db_functions.removePullRequestUser(id, pull_request.id, 'r');
        db_functions.removePoints(1, requested_reviewer.id);
      });
    });
  });



  //Commit on a PR -- works (event triggered when a new commit is added to a PR) -- both points work --> dans merged -- DONE
  app.on('pull_request.synchronize', context => {
    const { action, repository, pull_request, sender} = context.payload;
    utils.addPRToBdIfNull(pull_request);
  
    if (pull_request.body) {
      app.log.info(`PR description: ${pull_request.body} \n`);
    }

    if(sender.id != pull_request.user.id){
      app.log.info(`There was a suggestion of code done by: ${sender.login} on the PR which belongs to ${pull_request.user.login} \n`);
    }else{
      console.log("Pr user is the one who committed")
    }

  });

  //PR is being commented on
  app.on('issue_comment.created', (context) => {
    const { action, repository, issue, comment} = context.payload;
    if(issue.pull_request) {
      const { pull_request } = issue;
      const assignee = pull_request || null;
      utils.fetchPRDetails(pull_request.url).then((prDetails) => {
        const properPR = prDetails.data;
        utils.addPRToBdIfNull(properPR, () => {
          if(assignee && assignee != comment.user) {
            db_functions.addUserIfNullWithCallback(comment.user.id, comment.user.login, 0, () => {
              db_functions.addPoints(1, comment.user.id);
              utils.updateProgression('comment', comment.user.id, 1);
            });
          }
        }) 
      })
    }
  });

  //PR comment is being edited -- no points for it
  app.on('issue_comment.edited', (context) => {
    const { action, repository,issue, comment} = context.payload;
 

  });

  //PR comment is being deleted - DONE
  app.on('issue_comment.deleted', (context) => {
    const { action, repository,issue, comment} = context.payload;
    if(issue.pull_request) {
      const { pull_request } = issue;
      const assignee = pull_request || null;
      utils.fetchPRDetails(pull_request.url).then((prDetails) => {
        const properPR = prDetails.data;
        utils.addPRToBdIfNull(properPR, () => {
          if(assignee && assignee != comment.user) {
            db_functions.addUserIfNullWithCallback(comment.user.id, comment.user.login, 0, () => {
              db_functions.removePoints(1, comment.user.id);
              utils.updateProgression('comment', comment.user.id, -1);
            });
          }
        }) 
      })
    }    
  });

  // Existing comment on a PR is edited -- no points
  app.on('pull_request_review.edited', (context) => {
    const { action, repository, pull_request, review} = context.payload;
    if (pull_request.body) {
      app.log.info(`PR description: ${pull_request.body} \n`);
    }
  });

  //Comment submitted on a commit for review or when changes are requested or when approuved -DONE
  app.on('pull_request_review.submitted', async (context) => {
    const { action, repository, pull_request, review} = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      db_functions.addUserIfNullWithCallback(review.user.id, review.user.login, 0, () => {
        if(review.state === "changes_requested"){
          db_functions.addPoints(2, review.user.id);
          utils.updateProgression('comment', review.user.id, 1);      }
    
        if(review.state === "approved"){
          db_functions.addPoints(2, review.user.id);
        }
      });
    });
  });

  //Commenting directly on the code,then finishing review - DONE
  app.on('pull_request_review_comment.created', async (context) => {
    const { action, repository, pull_request, comment} = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      db_functions.addUserIfNullWithCallback(comment.user.id, comment.user.login, 0, () => {
        db_functions.addPoints(1, comment.user.id);
        utils.updateProgression('comment', comment.user.id, 1);
      });
    });
  });

  //Comment on the code being edited -- no points
  app.on('pull_request_review_comment.edited', async (context) => {
    const { action, repository, pull_request, comment, sender} = context.payload;
  });

  //Comment on the code being deleted - DONE
  app.on('pull_request_review_comment.deleted', async (context) => {
    const { action, repository, pull_request, comment, sender} = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      db_functions.addUserIfNullWithCallback(comment.user.id, comment.user.login, 0, () => {
        db_functions.removePoints(1, comment.user.id);
        utils.updateProgression('comment', comment.user.id, -1);
      });
    });
  });

  //PR has a thread that is resolved - DONE 
  app.on('pull_request_review_thread.resolved', async (context) => {
    const { action, repository, pull_request, sender, thread } = context.payload;
    utils.addPRToBdIfNull(pull_request, () => {
      console.log("pull")
      console.log("reactions", thread.comments[0].reactions['+1']);
  
  
      // pour chaque comment on check le role du user sur le comment 
      thread.comments.forEach(comment => {
        
        if(comment.user.login) {
          db_functions.fetchPullRequestUserWithCallback(pull_request.id, comment.user.id, (data) => {
            if(data[0].role = 'r'){
              const reactor_increment = comment.reactions['+1'] - comment.reactions['-1'];
              db_functions.addPoints(reactor_increment, comment.user.id);
              utils.updateProgression('react', comment.user.id, reactor_increment);
            }
          })
        }
      })
    });
  });
}
