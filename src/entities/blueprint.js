const { v4: uuid } = require("uuid");
const { PersistedEntity } = require("./base");
const _ = require("lodash");

const sortById = (array) => {
  return array.sort((a, b) => {
    let x = a.id.toLowerCase();
    let y = b.id.toLowerCase();
    if (x > y) {
      return 1;
    }
    if (x < y) {
      return -1;
    }
    return 0;
  })
};

const organize = (spec) => {
  const lanes = sortById(spec.lanes);
  const nodes = sortById(spec.nodes);
  return {
    lanes,
    nodes,
  };
}

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
      blueprint_spec: data.blueprint_spec,
    };
  }

  static serialize(blueprint) {
    return {
      id: blueprint.id,
      blueprint_spec: organize(blueprint.blueprint_spec),
    };
  }

  constructor(blueprint_spec) {
    super();
    this.id = uuid();
    this.blueprint_spec = organize(blueprint_spec);
  }

  async save(...args) {
    return await this.getPersist().save(this.serialize(), ...args);
  }
}

module.exports = {
  Blueprint,
};
