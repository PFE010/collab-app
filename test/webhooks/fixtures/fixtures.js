const fixtures = {
    pullRequestLabeled: {
      action: 'labeled',
      pull_request: {
        id: 123,
      },
    },
    pullRequestUnlabeled: {
      action: 'unlabeled',
      pull_request: {
        id: 456,
      },
    },
    pullRequestMerged: {
        action: 'closed',
        pull_request: {
          id: 101112,
          merged: true,
          merged_at: '2023-12-01T10:00:00Z',
        },
    },
    pullRequestClosed: {
        action: 'closed',
        pull_request: {
          id: 131415,
          state: 'closed',
        },
    },
    pullRequestReopened: {
      action: 'reopened',
      pull_request: {
        id: 789,
      },
    },
    pullRequestEdited: {
        action: 'edited',
        pull_request: {
          id: 123,
        },
    },
    pullRequestReviewRequested: {
        action: 'review_requested',
        pull_request: {
            id: 456,
        },
    },
    pullRequestReviewRequestRemoved: {
        action: 'review_request_removed',
        pull_request: {
            id: 789,
        },
        requested_reviewer: {
            login: 'bonoUser',
            id: 112334,
        }
    },
    pullRequestSynchronize: {
        action: 'synchronize',
        pull_request: {
            id: 101112,
            user: {
                id: 1132,
                login: 'boboUser',
            },
        },
        sender: {
            id: 1132,
            login: 'boboUser',
        },
    },
    issueCommentCreated: {
        action: 'created',
        issue: {
            number: 123,
        },
    },
    issueCommentEdited: {
        action: 'edited',
        issue: {
            number: 456,
        },
    },
    issueCommentDeleted: {
        action: 'deleted',
        issue: {
            number: 789,
        },
        comment: {
            user: {
                login: 'boboUser',
            },
        },
    },
    pullRequestReviewEdited: {
        action: 'edited',
        pull_request: {
            id: 101112,
        },
    },
    pullRequestReviewSubmitted: {
        action: 'submitted',
        pull_request: {
            id: 131415,
        },
        review: {
            stage: 'approved',
        }
    },
    pullRequestReviewCommentCreated: {
        action: 'created',
        pull_request: {
          id: 161718,
        },
        comment: {
            user: {
                login: 'bonoUser'
            }
        } 
      },
    pullRequestReviewCommentEdited: {
        action: 'edited',
        pull_request: {
            id: 192021,
        },
    },
    pullRequestReviewCommentDeleted: {
        action: 'deleted',
        pull_request: {
            id: 222324,
        },
    },
    pullRequestReviewThreadResolved: {
        action: 'resolved',
        pull_request: {
            id: 252627,
        },
    },
};

module.exports = fixtures;