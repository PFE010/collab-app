const {
    createAzureFunction,
    createProbot,
  } = require("@probot/adapter-azure-functions");
const app = require("../index");

module.exports = createAzureFunction(app, {
    probot: createProbot(),
});