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
      blueprint_id: data.blueprint_id,
      aligned: data.aligned,
      user_id: data.user_id,
      user_default: data.user_default,
      diagram_xml: data.diagram_xml,
      created_at: data.created_at,
      updated_at: data.updated_at,
      workflow_id: data.workflow_id
    }
  }

  static serialize(diagram) {
    return {
      id: diagram.id,
      name: diagram.name,
      user_id: diagram.user_id,
      user_default: diagram.user_default,
      diagram_xml: diagram.diagram_xml,
      blueprint_id: diagram.blueprint_id,
      aligned: diagram.aligned
    }
  }

  static async unsetDefault(...args) {
    await this.getPersist().unsetDefault(...args);
    return true;
  }

  constructor(name, user_id, diagram_xml, blueprint_id = null, user_default = false) {
    super();

    this.id = uuid();
    this.name = name;
    this.user_id = user_id;
    this.diagram_xml = diagram_xml;
    this.blueprint_id = blueprint_id;
    this.user_default = user_default;
  }

}

module.exports = {
  Diagram
}