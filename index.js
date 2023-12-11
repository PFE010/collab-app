const setupWebhookEvents = require('./src/index.js');
const setupApiEndpoints = require('./src/exposeRoutes.js');
const crypto = require('crypto');

module.exports = async (app, { getRouter }) => {
  setupApiEndpoints(app, getRouter);
  setupWebhookEvents(app);
}; 