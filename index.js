

module.exports = async (app) => {
  var points = 0;

  // Issues
  app.log.info("app was loaded!")
  app.on("issues.opened", async (context) => {
    points += 2;
    var issueComment = context.issue({
      body: "Thanks for opening this issue!" + points,
    });
    await context.octokit.issues.createComment(issueComment);
  });

  app.on("issues.closed", async (context) => {
    var issueComment = context.issue({
      body: "Thanks for closing this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  //Labels --> had to enable it manually on the repo
  app.on("label.created", async (context) => {
   
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
  
  });

  // Pull request
  app.on('pull_request.opened', async (context) => {
    try {
      const { owner, repo, number } = context.issue();

      // Fetch the pull request details
      const pullRequest = await context.github.pulls.get({
        owner,
        repo,
        pull_number: number,
      });

      const username = pullRequest.data.user.login;

      // Implement your reward logic here
      // For example, you can comment on the pull request to reward the user
      await context.github.issues.createComment({
        owner,
        repo,
        issue_number: number,
        body: `@${username} Thank you for opening this pull request! You've been rewarded! 🎉`,
      });

    } catch (error) {
      console.error('Error occurred:', error);
    }
  });

  app.on('pull_request.closed', async (context) => {
    try {
      const { owner, repo, number } = context.issue();

      // Fetch the pull request details
      const pullRequest = await context.github.pulls.get({
        owner,
        repo,
        pull_number: number,
      });

      const username = pullRequest.data.user.login;

      // Implement your reward logic here for closed pull requests
      // For example, you can send a direct message to the user
      await context.github.issues.createComment({
        owner,
        repo,
        issue_number: number,
        body: `@${username} Your pull request was closed. Thank you for your contribution!`,
      });

    } catch (error) {
      console.error('Error occurred:', error);
    }
  });
  app.on('pull_request.edited', async (context) => {

  });
  app.on('pull_request.labeled', async (context) => {
    app.log.info(context);

  });

  app.on('pull_request.unlabeled', async (context) => {
    console.log("hhhhh");
    const { owner, repo, pull_request, label } = context.payload;
  
    app.log.info(`Label '${label.name}' removed from pull request #${pull_request.number}`);
  
  });
  
  app.on('pull_request.ready_for_review', async (context) => {

  });
  app.on('pull_request.reopened', async (context) => {

  });
  app.on('pull_request.review_requested', async (context) => {

  });
  app.on('pull_request.unassigned', async (context) => {

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
