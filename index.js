const { DatabaseFunctions } = require('./src/services/db_functions')
const express = require('express')
const app = express()

 /**
   * - Créer la PR (done)
   * - Supprimer la PR (done)
   * - Ajouter un label (done)
   * - Enlever un label (done)
   * - Merge la PR (done)
   * - Reopen la PR (done) 
   * - Description de la PR (done)
   * - Ajouter un commit (done)
   * - Ajouter un commentaire à la PR (done) -- issue_comment
   * - Supprimer un commentaire à la PR (done) -- issue_comment
   * - Modifier un commentaire à la PR (done) -- issue_comment
   * - Accepter une suggestion du code (done) -- part of synchronize
   * - Faire une demande de changement (done) -- part of submitted
   * - Fermer un thread (done)
   * - Ajouter des commentaires en tant que review (done)-- pull_request_review
   * - Modifier des commentaires en tant que review (done)-- pull_request_review
   * - Supprimer des commentaires en tant que review (done)-- pull_request_review
   * - Approuver une PR (done) -- part of submitted

-Réactions sur commentaires (pouce en bas)
-Réactions sur commentaires (pouce en haut)
-masquer un commentaire (fonctionne comme un flag de commentaire abusif/spam)


   */

module.exports = async (app, { getRouter }) => {

  const db_functions = new DatabaseFunctions()

  // Get an express router to expose new HTTP endpoints
  const router = getRouter("/collab-app");

  // Use any middleware
  router.use(require("express").static("public"));

  function addHeader(res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    console.log(res);
    return res;
  };

  // Add a new route
  router.get("/pullRequests", (req, res) => {
    db_functions.fetchAllPr((result) => addHeader(res).send(result));
  });

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue! This is live from azure.",
    });
    return context.octokit.issues.createComment(issueComment);
  });

  // Pull request open -- works
  app.on('pull_request.opened', async (context) => {

    const { action,repository, pull_request} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, nbr commits: ${pull_request.commits}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    PR creator: ${pull_request.user.login}, user_id: ${pull_request.user.id}\n`);

    db_functions.createPR(pull_request.number, pull_request.url, pull_request.body, pull_request.created_at, null, pull_request.updated_at, pull_request.state, "")
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
  

  //PR is edited when the description is added or edited --works
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

  //PR reviewer is added
  app.on('pull_request.review_requested', async (context) => {
    const { action,repository, pull_request, requested_reviewer} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},\n
    PR time updated: ${pull_request.updated_at}, PR url: ${pull_request.url}, PR status: ${pull_request.state},\n
    Reviewer requested name: ${requested_reviewer.login}, Reviewer requested id: ${requested_reviewer.id}
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    PR creator: ${pull_request.user.login}, user_id: ${pull_request.user.id}\n`);

  });

   //PR reviewer is unadded
   app.on('pull_request.review_request_removed', async (context) => {
    const { action,repository, pull_request, requested_reviewer} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},\n
    PR time updated: ${pull_request.updated_at}, PR url: ${pull_request.url}, PR status: ${pull_request.state},\n
    Removed reviewer requested name: ${requested_reviewer.login}, Removed reviewer requested id: ${requested_reviewer.id}
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    PR creator: ${pull_request.user.login}, user_id: ${pull_request.user.id}\n`);

  });

  //PR assign -- works
  app.on('pull_request.assigned', async (context) => {

    const { action,repository, pull_request, assignee} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, PR time updated: ${pull_request.updated_at}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Assigner : ${pull_request.user.login}, user_id: ${pull_request.user.id}\n
    Assignee : ${assignee.login}, user_id: ${assignee.id}`);

  });

  //PR unassign -- works
  app.on('pull_request.unassigned', async (context) => {

    const { action,repository, pull_request, assignee} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, PR time updated: ${pull_request.updated_at}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Unassigner : ${pull_request.user.login}, user_id: ${pull_request.user.id}\n
    Unassignee : ${assignee.login}, user_id: ${assignee.id}`);

  });

  //Commit on a PR -- works (event triggered when a new commit is added to a PR)
  app.on('pull_request.synchronize', async context => {
    const { action,repository, pull_request, sender} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, PR time updated: ${pull_request.updated_at},
    Nbr of commits: ${pull_request.commits}, PR title: ${pull_request.title}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Commit done by : ${sender.login}, user_id: ${sender.id}\n`);

    if (pull_request.body) {
      app.log.info(`PR description: ${pull_request.body} \n`);
    }

    if(sender.id != pull_request.user.id){
      app.log.info(`There was a suggestion of code done by: ${sender.login} on the PR which belongs to ${pull_request.user.login} \n`);
    }

  });

  //PR is being commented on
  app.on('issue_comment.created', async context => {
    const { action,repository,issue, comment} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    Issue number: #${issue.number}, Issue id: ${issue.id}, PR url: ${issue.pull_request.url},\n
    Comment id: ${comment.id}, comment total reactions: ${comment.reactions.total_count},\n
    Comment created at: ${comment.created_at}, Comment updated at: ${comment.updated_at},\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name}, \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n`);

  });

  //PR comment is being edited
  app.on('issue_comment.edited', async context => {
    const { action,repository,issue, comment} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    Issue number: #${issue.number}, Issue id: ${issue.id}, PR url: ${issue.pull_request.url},\n
    Comment id: ${comment.id}, comment total reactions: ${comment.reactions.total_count},\n
    Comment created at: ${comment.created_at}, Comment updated at: ${comment.updated_at},\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name}, \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n`);

  });

  //PR comment is being deleted
  app.on('issue_comment.deleted', async context => {
    const { action,repository,issue, comment} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    Issue number: #${issue.number}, Issue id: ${issue.id}, PR url: ${issue.pull_request.url},\n
    Comment id: ${comment.id}, comment total reactions: ${comment.reactions.total_count},\n
    Comment created at: ${comment.created_at}, Comment updated at: ${comment.updated_at},\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name}, \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n`);

  });

  app.on('issue_comment.reaction.created', async context => {
    // Do something when a reaction is added to a comment
    app.log.info(`Action done: ${action}`);
  });

  // Pull request review

  //Not needed for now
  app.on('pull_request_review.dismissed', async (context) => {

  });

  //Existing comment on a PR is edited
  app.on('pull_request_review.edited', async (context) => {
    const { action,repository, pull_request, review} = context.payload;
  
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

    const { action,repository, pull_request, review} = context.payload;
  
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
    const { action,repository, pull_request, comment} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR id: #${pull_request.id}, Comment id: ${comment.id}, Commit id: ${comment.commit_id}, PR request id:${comment.pull_request_review_id}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n`);

  });
   //Comment on the code being edited
  app.on('pull_request_review_comment.edited', async (context) => {

    const { action,repository, pull_request, comment, sender} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR id: #${pull_request.id}, Comment id: ${comment.id}, Commit id: ${comment.commit_id}, PR request id:${comment.pull_request_review_id}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n
    Edited by: ${sender.login}`);
  });

  //Comment on the code being deleted
  app.on('pull_request_review_comment.deleted', async (context) => {
    const { action,repository, pull_request, comment, sender} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR id: #${pull_request.id}, Comment id: ${comment.id}, Commit id: ${comment.commit_id}, PR request id:${comment.pull_request_review_id}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Comment made by : ${comment.user.login}, user_id: ${comment.user.id}\n
    Deleted by: ${sender.login}`);

  });

  //PR has a thread that is resolved
  app.on('pull_request_review_thread.resolved', async (context) => {
    const { action,repository, pull_request, sender} = context.payload;
  
    app.log.info(`Action done: ${action}\n 
    PR id: #${pull_request.id}, \n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Resolved by : ${sender.login}, user_id: ${sender.id}\n`);
  });
}; 
