import { Probot } from "probot";

export = (app: Probot) => {

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


  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
