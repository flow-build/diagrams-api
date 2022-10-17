const { logger } = require('./utils/logger');
const { PersistorProvider } = require('./persist/provider');
const { Diagram } = require('./entities/diagram');

class DiagramCore {

  static get instance() {
    return Diagram._instance;
  }

  static set instance(instance) {
    Diagram._instance = instance;
  }

  static get persistor() {
    return Diagram._persistor;
  }

  static set persistor(instance) {
    Diagram._persistor = instance;
  }

  constructor(persist_args) {
    if (Diagram.instance) {
      return Diagram.instance;
    }
    PersistorProvider.getPersistor(persist_args);
    this._db = persist_args;
    Diagram.instance = this;
  }

  async saveDiagram(diagram_obj) {
    logger.debug('saveDiagram service called');
    const { name, user_id, diagram_xml } = diagram_obj;

    return await new Diagram(name, user_id, diagram_xml).save();
  }

  async getAllDiagrams() {
    logger.debug('getAllDiagrams service called');
  
    return await Diagram.fetchAll();
  }

  async getDiagramsByUserId(user_id) {
    logger.debug('getDiagramsByUserId service called');

    return await Diagram.fetchByUserId(user_id);
  }

  async getDiagramById(id) {
    logger.debug('getDiagramById service called');

    return await Diagram.fetch(id);
  }

  async getDiagramsByWorkflowId(workflow_id) {
    logger.debug('getDiagramsByWorkflowId service called');

    return await Diagram.fetchByWorkflowId(workflow_id);
  }

  async getLatestDiagramByWorkflowId(workflow_id) {
    logger.debug('getLatestDiagramByWorkflowId service called');
  
    return await Diagram.fetchLatestByWorkflowId(workflow_id);
  }

  async getDiagramsByUserAndWF(user_id, workflow_id) {
    logger.debug('getDiagramsByUserAndWF service called');
  
    return await Diagram.fetchByUserAndWF(user_id, workflow_id);
  }

  async updateDiagram(id, diagram_obj) {
    logger.debug('updateDiagram service called');

    return await Diagram.update(id, diagram_obj);
  }

  async deleteDiagram(id) {
    logger.debug('deleteDiagram service called');

    return await Diagram.delete(id);
  }
}

module.exports = {
  DiagramCore
}