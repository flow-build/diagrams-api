const { v4: uuid } = require('uuid');
const { PersistedEntity } = require('./base');
const _ = require('lodash');

class Server extends PersistedEntity {
  static getEntityClass() {
    return Server;
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
      url: data.url,
      namespace: data.namespace,
      is_syncing: data.is_syncing,
      config: data.config,
      last_sync: data.last_sync,
    };
  }

  static serialize(server) {
    return {
      id: server.id,
      url: server.url,
      namespace: server.namespace,
      is_syncing: server.is_syncing,
      config: server.config,
    };
  }

  static async fetchByUrl(...args) {
    const serialized = await this.getPersist().getByUrl(...args);
    return this.deserialize(serialized);
  }

  constructor(url, namespace, config = null, is_syncing = false) {
    super();

    this.id = uuid();
    this.url = url;
    this.namespace = namespace;
    this.config = config;
    this.is_syncing = is_syncing;
  }
}

module.exports = {
  Server,
};
