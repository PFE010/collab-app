const { ClientManager } = require('./src/client_manager')


module.exports = async (app) => {
  var points = 0;

  const client_manager = new ClientManager(app);

  app.log.info("app was loaded!")
}; 
