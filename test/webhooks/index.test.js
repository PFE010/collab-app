const nock = require("nock");

const myProbotApp = require("../../src/index.js");

const { Probot, ProbotOctokit } = require("probot");
// Requiring our fixtures
const pullRequestOpenedPayload = require("./fixtures/pull_request.opened.json");
const pullRequestClosedPayload = require("./fixtures/pull_request.closed.json");
const pullRequestAssignedPayload = require("./fixtures/pull_request.assigned.json");
const pullRequestUnassignedPayload = require("./fixtures/pull_request.unassigned.json");

const fixtures = require('./fixtures/fixtures.js');

const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(
  path.join(__dirname, "fixtures/mock-cert.pem"),
  "utf-8"
);

const mockFunctions = {
  addPR: jest.fn(),
  editPRField: jest.fn(),
  addPoints: jest.fn(),
  updateProgression: jest.fn(),
  fetchPrWithCallback: jest.fn(),
  fetchUserWithCallback: jest.fn(),
  addUserIfNullWithCallback: jest.fn(),
};

jest.mock('../../src/services/db_functions', () => ({
  DatabaseFunctions: jest.fn().mockImplementation(() => mockFunctions),
}));

describe("Collab-app webhook events", () => {
  let probot;

  beforeEach(() => {
    const db_functions_mocked = require('../../src/services/db_functions');
    nock.disableNetConnect();
    probot = new Probot({
      appId: 123,
      privateKey,
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });
    // Load our app into probot
    probot.load(myProbotApp);
  });

  test('it should handle pull_request.opened event', async () => {
    await probot.receive({ name: 'pull_request.closed', payload: pullRequestClosedPayload });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('it should handle pull_request.closed event', async () => {
    await probot.receive({ name: 'pull_request.closed', payload: pullRequestClosedPayload });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test("handles pull request assigned event", async () => {
    await probot.receive({ name: "pull_request.assigned", payload: pullRequestAssignedPayload });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test("handles pull request unassigned event", async () => {
    await probot.receive({ name: "pull_request.unassigned", payload: pullRequestUnassignedPayload });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request merged event', async () => {
    await probot.receive({ name: 'pull_request.merged', payload: fixtures.pullRequestMerged });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request reopened event', async () => {
    await probot.receive({ name: 'pull_request.reopened', payload: fixtures.pullRequestReopened });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request edited event', async () => {
    await probot.receive({ name: 'pull_request.edited', payload: fixtures.pullRequestEdited });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request review requested event', async () => {
    await probot.receive({ name: 'pull_request.review_requested', payload: fixtures.pullRequestReviewRequested });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request review request removed event', async () => {
    await probot.receive({ name: 'pull_request.review_request_removed', payload: fixtures.pullRequestReviewRequestRemoved });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request synchronize event', async () => {
    await probot.receive({ name: 'pull_request.synchronize', payload: fixtures.pullRequestSynchronize });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles issue comment created event', async () => {
    await probot.receive({ name: 'issue_comment.created', payload: fixtures.issueCommentCreated });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles issue comment edited event', async () => {
    await probot.receive({ name: 'issue_comment.edited', payload: fixtures.issueCommentEdited });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles issue comment deleted event', async () => {
    await probot.receive({ name: 'issue_comment.deleted', payload: fixtures.issueCommentDeleted });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request review edited event', async () => {
    await probot.receive({ name: 'pull_request_review.edited', payload: fixtures.pullRequestReviewEdited });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request review submitted event', async () => {
    await probot.receive({ name: 'pull_request_review.submitted', payload: fixtures.pullRequestReviewSubmitted });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request review comment created event', async () => {
    await probot.receive({ name: 'pull_request_review_comment.created', payload: fixtures.pullRequestReviewCommentCreated });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request review comment edited event', async () => {
    await probot.receive({ name: 'pull_request_review_comment.edited', payload: fixtures.pullRequestReviewCommentEdited });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request review comment deleted event', async () => {
    await probot.receive({ name: 'pull_request_review_comment.deleted', payload: fixtures.pullRequestReviewCommentDeleted });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  test('handles pull request review thread resolved event', async () => {
    await probot.receive({ name: 'pull_request_review_thread.resolved', payload: fixtures.pullRequestReviewThreadResolved });
    expect(mockFunctions.fetchPrWithCallback).toHaveBeenCalled();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
