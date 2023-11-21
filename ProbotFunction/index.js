const {
    createAzureFunction,
    createProbot,
  } = require("@probot/adapter-azure-functions");
  const app = require("../idnex");
  module.exports = createAzureFunction(app, {
    probot: createProbot(),
});