

module.exports = async (app) => {
  var points = 0;

  // Issue opened --> no points associated to it
  /**app.log.info("app was loaded!")
  app.on("issues.opened", async (context) => {
    points += 2;
    
    const { action,repository, issue} = context.payload;

    app.log.info(`Action done: ${action}\n 
    Issue number: #${issue.number}, issue id: ${issue.id}, issue time creation: ${issue.created_at},
    issue status: ${issue.state}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    issue opened by: ${issue.user.login}, user_id: ${issue.user.id}\n
    assigned to: ${issue.assignee.login}, user_id: ${issue.assignee.id}`);

    var issueComment = context.issue({
      body: "Thanks for opening this issue!" + points,
    });
    await context.octokit.issues.createComment(issueComment);
  });

  //issue closed
  app.on("issues.closed", async (context) => {

    const { action,repository, issue} = context.payload;

    app.log.info(`Action done: ${action}\n 
    Issue number: #${issue.number}, issue id: ${issue.id}, issue time creation: ${issue.created_at},
    issue updated time: ${issue.updated_at}, issue status: ${issue.state}\n
    Number of comments: ${issue.comments}\n 
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    issue opened by: ${issue.user.login}, user_id: ${issue.user.id}\n
    assigned to: ${issue.assignee.login}, user_id: ${issue.assignee.id}`);

    var issueComment = context.issue({
      body: "Thanks for closing this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });*/


  //Labels --> had to enable it manually on the repo
  /**app.on("label.created", async (context) => {
   
    //app.log.info(context);
      
  });

  app.on("label.deleted", async (context) => {
    app.log.info(context);
    //const { owner, repo, label } = context.payload;
    //app.log.info(`Label deleted: ${label.name}`);
  
  });
  
  app.on("label.edited", async (context) => {
    //app.log.info(context);
    //const { owner, repo, label } = context.payload;
    //app.log.info(`Label deleted: ${label.name}`);
  
  });*/


  /**
   * - Création de PR (done)
   * - Supprimer la PR (done)
   * - Ajouter un label (done)
   * - Enlever un label (done)
   * - Merge la PR (done)
   * - Reopen la PR (done) 
   * - Description de la PR (done)
-Ajout de commentaires
-Ajout des commits (suite a une demande de changement)
-Temps de réponse aux commentaires
-Réactions sur commentaires (pouce en bas)
-Réactions sur commentaires (pouce en haut)
-masquer un commentaire (fonctionne comme un flag de commentaire abusif/spam)
-Accepter une suggestion de code
-Facteur de temps PR date ouverture / date merge
-Resolve conversation (thread)
-supprimer un commentaire
   */

  // Pull request open -- works
  app.on('pull_request.opened', async (context) => {

    const { action,repository, pull_request} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, nbr commits: ${pull_request.commits}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    PR creator: ${pull_request.user.login}, user_id: ${pull_request.user.id}\n`);

    // Check if the pull request has a description
    if (pull_request.body) {
      app.log.info(`PR description: ${pull_request.body} \n`);
    } else {
      app.log.info("PR has no description, please add one \n");
    }
  });

  //PR closed -- works
  app.on('pull_request.closed', async (context) => {
    const { action, repository, pull_request } = context.payload;
  
    app.log.info(`Action done: ${action}\n 
      PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
      PR url: ${pull_request.url}, PR status: ${pull_request.state}\n
      Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
      PR creator: ${pull_request.user.login}, user_id: ${pull_request.user.id}
      PR merged: ${pull_request.merged}`);
  
    // Check if the pull request is merged
    if (pull_request.merged) {
      app.log.info(`PR merged by: ${pull_request.merged_by.login} \n`);
    } else {
      app.log.info("PR was not merged. \n");
    }
  });
  

  // added description later on
  app.on('pull_request.edited', async (context) => {
    const { action,repository, pull_request} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    PR creator: ${pull_request.user.login}, user_id: ${pull_request.user.id}\n`);

    // Check if the pull request has a description
    if (pull_request.body) {
      app.log.info(`PR description was added: ${pull_request.body} \n`);
    }

  });

  //PR is being labeled --- works
  app.on('pull_request.labeled', async (context) => {
    //app.log.info(context);
    const { action,repository, pull_request, label} = context.payload;

    app.log.info(`Action done: ${action}\n 
    Removed from pull request: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR updated time: ${pull_request.updated_at}, PR status: ${pull_request.state}\n
    Label name: ${label.name}, label id: ${label.id}\n 
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    user login: ${pull_request.user.login}, user_id: ${pull_request.user.id}\n`);

  });

  //PR is being unlabeled --- works
  app.on('pull_request.unlabeled', async (context) => {
    const { action,repository, pull_request, label} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    Removed from pull request: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR updated time: ${pull_request.updated_at}, PR status: ${pull_request.state}\n
    Label name: ${label.name}, label id: ${label.id}\n 
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    user login: ${pull_request.user.login}, user_id: ${pull_request.user.id}\n`);
  
  });
  
  app.on('pull_request.ready_for_review', async (context) => {

  });

  //Reopening a PR -- works
  app.on('pull_request.reopened', async (context) => {
    const { action,repository, pull_request} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    PR creator: ${pull_request.user.login}, user_id: ${pull_request.user.id}\n`);

  });
  app.on('pull_request.review_requested', async (context) => {

  });

  //PR assign -- works
  app.on('pull_request.assigned', async (context) => {

    const { action,repository, pull_request, assignee} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, PR time creation: ${pull_request.updated_at}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Assigner : ${pull_request.user.login}, user_id: ${pull_request.user.id}\n
    Assignee : ${assignee.login}, user_id: ${assignee.id}`);

  });

  //PR unassign -- works
  app.on('pull_request.unassigned', async (context) => {

    const { action,repository, pull_request, assignee} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, PR time creation: ${pull_request.updated_at}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Unassigner : ${pull_request.user.login}, user_id: ${pull_request.user.id}\n
    Unassignee : ${assignee.login}, user_id: ${assignee.id}`);

  });

  // Pull request review

  app.on('pull_request_review.dismissed', async (context) => {

  });
  app.on('pull_request_review.edited', async (context) => {

  });
  app.on('pull_request_review.submitted', async (context) => {

  });

  // Pull request review comment

  app.on('pull_request_review_comment.created', async (context) => {

  });
  app.on('pull_request_review_comment.edited', async (context) => {

  });
  app.on('pull_request_review_comment.deleted', async (context) => {

  });
}; 
