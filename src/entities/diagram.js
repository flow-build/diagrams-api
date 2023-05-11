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
      type: data.type,
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
      type: diagram.type,
      blueprint_id: diagram.blueprint_id,
      user_id: diagram.user_id,
      user_default: diagram.user_default,
      is_public: diagram.is_public,
      is_aligned: diagram.is_aligned,
    }
  }

  static async unsetDefault(...args) {
    await this.getPersist().unsetDefault(...args);
    return true;
  }

  static async setDefault(...args) {
    const { rows } = await this.getPersist().setDefault(...args);
    const default_ = rows.find(r => r.user_default === true);
    return this.deserialize(default_);
  }

  constructor(name, diagram_xml, user_id = null, is_public = null, blueprint_id = null, user_default = false, type = 'standard') {
    super();

    this.id = uuid();
    this.name = name;
    this.user_id = user_id;
    this.diagram_xml = diagram_xml;
    this.blueprint_id = blueprint_id;
    this.is_public = is_public;
    this.user_default = user_default
    this.type = type
  }

}

module.exports = {
  Diagram
}