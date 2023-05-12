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

  async saveBlueprint(blueprint_spec) {
    logger.debug('saveBlueprint service called');

    return await new Blueprint(blueprint_spec).save();
  }

  async getBlueprintById(id) {
    logger.debug('getBlueprintById service called');

    return await Blueprint.fetch(id);
  }

  async updateBlueprint(id, blueprint_spec) {
    logger.debug('updateBlueprint service called');

    return await Blueprint.update(id, blueprint_spec);
  }

  async deleteBlueprint(id) {
    logger.debug('deleteBlueprint service called');

    return await Blueprint.delete(id);
  }
}

module.exports = {
  BlueprintCore,
};
