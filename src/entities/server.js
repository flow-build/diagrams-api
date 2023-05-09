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
      config: data.config,
      last_sync: data.last_sync,
    }
  }

  static serialize(server) {
    return {
      id: server.id,
      url: server.url,
      config: server.config,
    }
  }

  constructor(url, config = null) {
    super();

    this.id = uuid();
    this.url = url;
    this.config = config;
  }

}

module.exports = {
  Server
}