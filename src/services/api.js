const { Octokit } = require("@octokit/rest");

class Api {
    octokit;

    constructor(octokit) {
        this.octokit = octokit;
    }

    async fetchPRDetails(owner, repo, number) {
        const response = await this.octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
            owner: owner,
            repo: repo,
            pull_number: number,
            header: {
                accept: 'application/vnd.github+json'
            } 
        });
        return response;
    }
}

module.exports = async function initializeApi() {
    require('dotenv').config();

    try {
        const fetchModule = await import('node-fetch');
        const { default: fetch } = fetchModule;

        const authValue = process.env.AUTH_TOKEN;

        const octokit = new Octokit({
            auth: authValue,
            userAgent: 'Collab-app v1.0.0',
            log: {
                debug: () => {},
                info: () => {},
                warn: console.warn,
                error: console.error
            },
            request: {
                fetch: fetch 
            }
        });

        // Create an instance of the API class
        const api = new Api(octokit);
        return api;
    } catch (error) {
        console.error('Error while initializing API:', error);
        throw error;
    }
};
