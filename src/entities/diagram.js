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
      created_at: data.created_at,
      updated_at: data.updated_at,
      name: data.name,
      diagram_xml: data.diagram_xml,
      blueprint_id: data.blueprint_id,
      user_id: data.user_id,
      is_public: data.is_public,
      user_default: data.user_default,
      is_aligned: data.is_aligned,
      workflow_id: data.workflow_id,
    }
  }

  static serialize(diagram) {
    return {
      id: diagram.id,
      name: diagram.name,
      diagram_xml: diagram.diagram_xml,
      blueprint_id: diagram.blueprint_id,
      user_id: diagram.user_id,
      user_default: diagram.user_default,
      is_public: diagram.is_public,
      is_aligned: diagram.is_aligned,
    }
  }

  constructor(name, diagram_xml, user_id = null, is_public = null, blueprint_id = null) {
    super();

    this.id = uuid();
    this.name = name;
    this.user_id = user_id;
    this.diagram_xml = diagram_xml;
    this.blueprint_id = blueprint_id;
    this.is_public = is_public;
  }

}

module.exports = {
  Diagram
}