const { PersistedEntity } = require('./base');
const _ = require('lodash');

class DiagramToWorkflow extends PersistedEntity {
  static getEntityClass() {
    return DiagramToWorkflow;
  }

  static deserialize(serialized) {
    if (!serialized) {
      return;
    }
    
    if (_.isArray(serialized)) {
      return serialized.map((data) => this._deserialized(data));
    } else {
      return this._deserialized(serialized);
    }
  }

  static _deserialized(data) {
    return {
      diagram_id: data.diagram_id,
      workflow_id: data.workflow_id
    }
  }

  static serialize(diagramToWorkflow) {
    return {
      diagram_id: diagramToWorkflow.diagram_id,
      workflow_id: diagramToWorkflow.workflow_id
    }
  }

  constructor(diagram_id, workflow_id) {
    super();

    this.diagram_id = diagram_id;
    this.workflow_id = workflow_id;
  }

}

module.exports = {
  DiagramToWorkflow
}