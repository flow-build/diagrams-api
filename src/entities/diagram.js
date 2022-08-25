const { v4: uuid } = require('uuid'); 
const { PersistedEntity } = require('./base');
const _ = require('lodash');

class Diagram extends PersistedEntity {
  static getEntityClass() {
    return Diagram;
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
      id: data.id,
      name: data.name,
      workflow_id: data.workflow_id,
      user_id: data.user_id,
      diagram_xml: data.diagram_xml,
      created_at: data.created_at,
      updated_at: data.updated_at
    }
  }

  static serialize(diagram) {
    return {
      id: diagram.id,
      name: diagram.name,
      user_id: diagram.user_id,
      diagram_xml: diagram.diagram_xml,
      workflow_id: diagram.workflow_id
    }
  }

  constructor(name, user_id, diagram_xml, workflow_id = null, id = null) {
    super();

    this.id = id || uuid();
    this.name = name;
    this.user_id = user_id;
    this.diagram_xml = diagram_xml;
    this.workflow_id = workflow_id;
  }

}

module.exports = {
  Diagram
}