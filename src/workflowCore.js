const { logger } = require('./utils/logger');
const { PersistorProvider } = require('./persist/provider');
const { Workflow } = require('./entities/workflow');

class WorkflowCore {

  static get instance() {
    return Workflow._instance;
  }

  static set instance(instance) {
    Workflow._instance = instance;
  }

  static get persistor() {
    return Workflow._persistor;
  }

  static set persistor(instance) {
    Workflow._persistor = instance;
  }

  constructor(persist_args) {
    if (Workflow.instance) {
      return Workflow.instance;
    }
    PersistorProvider.getPersistor(persist_args);
    this._db = persist_args;
    Workflow.instance = this;
  }

  async saveWorkflow(workflow_obj) {
    logger.debug('saveWorkflow service called');
    const { id, server, blueprint_id } = workflow_obj;

    return await new Workflow(id, server, blueprint_id).save();
  }

  async getWorkflowById(id) {
    logger.debug('getWorkflowById service called');

    return await Workflow.fetch(id);
  }
}

module.exports = {
  WorkflowCore
}