const { Diagram } = require('../diagramCore');

class KnexPersist {
  constructor(db, class_, table) {
    this._db = db;
    this._class = class_;
    this._table = table;
  }

  async delete(obj_id) {
    return await this._db(this._table).where('id', obj_id).del();
  }

  async get(obj_id) {
    return await this._db.select('*').from(this._table).where('id', obj_id).first();
  }

}

class DiagramKnexPersist extends KnexPersist {
  constructor(db) {
    super(db, Diagram, 'diagrams');
  }

  async getAll() {
    return await this._db(this._table).select('*').orderBy('updated_at', 'desc');
  }

  async save(diagram) {
    await this._db(this._table).insert(diagram);
    return 'create';
  }

  async update(diagram_id, diagram) {
    return await this._db(this._table).where('id', diagram_id)
      .update({...diagram, updated_at: 'now' })
      .returning('*');
  }

  async getByUserId(user_id) {
    return await this._db(this._table).select('*').where('user_id', user_id)
      .orderBy('updated_at', 'desc');
  }
  
  async getByWorkflowId(workflow_id) {
    return await this._db(this._table).select('*').where('workflow_id', workflow_id)
      .orderBy('updated_at', 'desc');
  }
  
  async getLatestByWorkflowId(workflow_id) {
    return await this._db(this._table).select('*').where('workflow_id', workflow_id)
      .orderBy('updated_at', 'desc')
      .first();
  }
  
  async getByUserAndWF(user_id, workflow_id) {
    return await this._db(this._table).select('*')
      .where('workflow_id', workflow_id)
      .andWhere('user_id', user_id)
      .orderBy('updated_at', 'desc');
  }
}

module.exports = {
  DiagramKnexPersist
}