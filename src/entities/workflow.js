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
      server: data.server,
      blueprint_id: data.blueprint_id
    }
  }

  static serialize(workflow) {
    return {
      id: workflow.id,
      server: workflow.server,
      blueprint_id: workflow.blueprint_id
    }
  }

  constructor(id, server, blueprint_id) {
    super();

    this.id = id;
    this.server = server;
    this.blueprint_id = blueprint_id;
  }

}

module.exports = {
  Workflow
}