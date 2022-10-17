const { v4: uuid } = require('uuid');
const { PersistedEntity } = require('./base');
const _ = require('lodash');

class Blueprint extends PersistedEntity {
  static getEntityClass() {
    return Blueprint;
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
      blueprint_spec: data.blueprint_spec
    }
  }

  static serialize(blueprint) {
    return {
      id: blueprint.id,
      blueprint_spec: blueprint.blueprint_spec
    }
  }

  constructor(blueprint_spec) {
    super();

    this.id = uuid();
    this.blueprint_spec = blueprint_spec;
  }

}

module.exports = {
  Blueprint
}