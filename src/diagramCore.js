const { logger } = require('./utils/logger');
const { PersistorProvider } = require('./persist/provider');
const { Diagram } = require('./entities/diagram');
const { BlueprintCore } = require('./blueprintCore');
const { WorkflowCore } = require('./workflowCore');

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
    const { name, user_id, user_default, diagram_xml, workflow_data, isPublic, type } = diagram_obj;
    let userId;
    if (!isPublic) {
      userId = user_id
    }
    if (user_default) {
      await Diagram.unsetDefault({ user_id: userId });
    }
    const diagram = await new Diagram(name, diagram_xml, userId, isPublic, null, user_default, type).save();

    let blueprint;
    if (workflow_data) {
      if (workflow_data.blueprint_spec) {
        blueprint = await new BlueprintCore(this._db).saveBlueprint(workflow_data.blueprint_spec)
        await Diagram.update(diagram.id, { blueprint_id: blueprint.id })
      }
      if (workflow_data.id) {
        const workflow = await new WorkflowCore(this._db).saveWorkflow({
          id: workflow_data.id,
          name: workflow_data.name,
          version: workflow_data.version,
          server_id: workflow_data.server_id,
          blueprint_id: blueprint.id
        })
        const response = await Diagram.fetch(diagram.id);
        delete response.diagram_xml;
        return {
          ...response,
          ...{
            workflow_id: workflow.id,
            workflow_name: workflow.name,
            version: workflow.version,
            server_id: workflow.server_id,
            blueprint_id: workflow.blueprint_id
          }
        }
      }
    }

    return diagram;

  }

  async setAsDefault(id) {
    logger.debug('setAsDefault service called');

    const diagram = await Diagram.fetch(id);
    if (diagram) {
      return await Diagram.setDefault({ id, user_id: diagram.user_id });
    }
    throw new Error('Diagram not found')
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

  async getDiagramsByWorkflowId(workflow_id, user_id = null) {
    logger.debug('getDiagramsByWorkflowId service called');

    return await Diagram.fetchByWorkflowId(workflow_id, user_id);
  }


  async getLatestDiagramByWorkflowId(workflow_id) {
    logger.debug('getLatestDiagramByWorkflowId service called');

    return await Diagram.fetchLatestByWorkflowId(workflow_id);
  }

  async getDiagramsByUserAndWF(user_id, workflow_id) {
    logger.debug('getDiagramsByUserAndWF service called');

    return await Diagram.fetchByUserAndWF(user_id, workflow_id);
  }

  async getDefaultDiagram(user_id, filters = {}) {
    logger.debug('getDefaultDiagram service called');

    return await Diagram.getDefaultDiagram(user_id, filters);
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