const { logger } = require('./utils/logger');
const { PersistorProvider } = require('./persist/provider');
const { DiagramToWorkflow } = require('./entities/diagramToWorkflow');

class DiagramToWorkflowCore {

  static get instance() {
    return DiagramToWorkflow._instance;
  }

  static set instance(instance) {
    DiagramToWorkflow._instance = instance;
  }

  static get persistor() {
    return DiagramToWorkflow._persistor;
  }

  static set persistor(instance) {
    DiagramToWorkflow._persistor = instance;
  }

  constructor(persist_args) {
    if (DiagramToWorkflow.instance) {
      return DiagramToWorkflow.instance;
    }
    PersistorProvider.getPersistor(persist_args);
    this._db = persist_args;
    DiagramToWorkflow.instance = this;
  }

  async saveDiagramToWorkflow(data_obj) {
    logger.debug('saveDiagramToWorkflow service called');
    const { diagram_id, workflow_id } = data_obj;

    return await new DiagramToWorkflow(diagram_id, workflow_id).save();
  }

  async getWorkflowIdsByDiagramId(diagram_id) {
    logger.debug('getWorkflowIdsByDiagramId service called');

    return await DiagramToWorkflow.fetchWorkflowIdsByDiagramId(diagram_id);
  }

  async getDiagramIdsByWorkflowId(workflow_id) {
    logger.debug('getDiagramIdsByWorkflowId service called');

    return await DiagramToWorkflow.fetchDiagramIdsByWorkflowId(workflow_id);
  }

  async deleteByDiagramId(diagram_id) {
    logger.debug('deleteByDiagramId service called');

    return await DiagramToWorkflow.deleteByDiagramId(diagram_id);
  }

  async deleteByWorkflowId(workflow_id) {
    logger.debug('deleteByWorkflowId service called');

    return await DiagramToWorkflow.deleteByWorkflowId(workflow_id);
  }
}

module.exports = {
  DiagramToWorkflowCore
}