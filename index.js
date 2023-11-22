module.exports = async (app) => {
  app.log.info("app was loaded!")
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });
  app.on("issues.closed", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for closing this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  }); 
}; 
