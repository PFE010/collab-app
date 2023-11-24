class ClientManager {

    constructor (app) {
        this.listen(app)
    }

    listen(app){
        // Issues
        app.on("issues.opened", async (context) => {
            points += 2;
            var issueComment = context.issue({
            body: "Thanks for opening this issue!" + points,
            });
            await context.octokit.issues.createComment(issueComment);
        });

        // Pull request open, what can we check upon PR creation?
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
        // TODO: check if its deleted or merged, if merged give points to assignees / reviewers
        app.on('pull_request.closed', async (context) => {

        });

        // TODO: check which user has been assigned to which role, 2 points to assignee
        app.on('pull_request.assigned', async (context) => {

        });
        // TODO: check which user has been unassigned to which role, no points at all
        app.on('pull_request.unassigned', async (context) => {

        });
        // TODO: check howmany labels, 2 points per label for max of 4 points
        app.on('pull_request.labeled', async (context) => {

        });

        // TODO: maybe we can give 1 point for this?
        app.on('pull_request.review_requested', async (context) => {

        });

        // TODO: check what has been edited and give / remove points accordingly
        app.on('pull_request.edited', async (context) => {

        });

        // TODO: check time between closure and reopening, idk?
        app.on('pull_request.reopened', async (context) => {

        });



        // Pull request review

        // TODO: give points to reviewers, track submitted time
        app.on('pull_request_review.submitted', async (context) => {

        });

        // I don't think we need this one.
        app.on('pull_request_review.edtited', async (context) => {

        });

        // TODO: give 1 points to both
        app.on('pull_request_review.dismissed', async (context) => {

        });

        // Pull request review comment

        // TODO: check who created the comment, give 1 point to that user
        app.on('pull_request_review_comment.created', async (context) => {

        });

        // dont think we need this one either
        app.on('pull_request_review_comment.edited', async (context) => {

        });
        // TODO: make sure the user who deleted is not stacking points.
        app.on('pull_request_review_comment.deleted', async (context) => {

        });

        // pull_request_review_thread

        // TODO: give 1 point to both reviewer and assignee. Or check who participated in thread?
        app.on('pull_request_review_thread.resolved', async (context) => {

        });
    }

}

module.exports = { ClientManager: ClientManager }
