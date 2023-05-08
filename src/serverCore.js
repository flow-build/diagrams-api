const { logger } = require('./utils/logger');
const { PersistorProvider } = require('./persist/provider');
const { Server } = require('./entities/server');

class ServerCore {

  static get instance() {
    return Server._instance;
  }

  static set instance(instance) {
    Server._instance = instance;
  }

  static get persistor() {
    return Server._persistor;
  }

  static set persistor(instance) {
    Server._persistor = instance;
  }

  constructor(persist_args) {
    if (Server.instance) {
      return Server.instance;
    }
    PersistorProvider.getPersistor(persist_args);
    this._db = persist_args;
    Server.instance = this;
  }

  async saveServer(data_obj) {
    logger.debug('saveServer service called');
    const { url, event_broker } = data_obj;

    return await new Server(url, event_broker).save();
  }

  async getAllServers() {
    logger.debug('getAllServers service called');

    return await Server.fetchAll(diagram_id);
  }

  async deleteServer(server_id) {
    logger.debug('deleteServer service called');

    return await Server.delete(server_id);
  }
}

module.exports = {
  ServerCore
}