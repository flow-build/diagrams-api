const { logger } = require('./utils/logger');
const { PersistorProvider } = require('./persist/provider');
const { Blueprint } = require('./entities/blueprint');

class BlueprintCore {

  static get instance() {
    return Blueprint._instance;
  }

  static set instance(instance) {
    Blueprint._instance = instance;
  }

  static get persistor() {
    return Blueprint._persistor;
  }

  static set persistor(instance) {
    Blueprint._persistor = instance;
  }

  constructor(persist_args) {
    if (Blueprint.instance) {
      return Blueprint.instance;
    }
    PersistorProvider.getPersistor(persist_args);
    this._db = persist_args;
    Blueprint.instance = this;
  }

  async saveBlueprint(blueprint_obj) {
    logger.debug('saveBlueprint service called');
    const { blueprint_spec } = blueprint_obj;

    return await new Blueprint(blueprint_spec).save();
  }

  async getBlueprintById(id) {
    logger.debug('getBlueprintById service called');

    return await Blueprint.fetch(id);
  }
}

module.exports = {
  BlueprintCore
}