const setupWebhookEvents = require('./src/index.js');
const setupApiEndpoints = require('./src/exposeRoutes.js');

module.exports = async (app, { getRouter }) => {
  setupApiEndpoints(app, getRouter);
  setupWebhookEvents(app);
}; 