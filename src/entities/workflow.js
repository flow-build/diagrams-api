const { PersistedEntity } = require('./base');
const _ = require('lodash');

class Workflow extends PersistedEntity {
  static getEntityClass() {
    return Workflow;
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
      version: data.version,
      server_id: data.server_id,
      blueprint_id: data.blueprint_id
    }
  }

  static serialize(workflow) {
    return {
      id: workflow.id,
      name: workflow.name,
      version: workflow.version,
      server_id: workflow.server_id,
      blueprint_id: workflow.blueprint_id
    }
  }

  constructor(id, name, version, blueprint_id, server_id) {
    super();

    this.id = id;
    this.name = name;
    this.version = version;
    this.blueprint_id = blueprint_id;
    this.server_id = server_id;
  }

}

module.exports = {
  Workflow
}