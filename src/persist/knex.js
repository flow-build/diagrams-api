const { Diagram } = require('../entities/diagram');
const { Blueprint } = require('../entities/blueprint');
const { Workflow } = require('../entities/workflow');
const { DiagramToWorkflow } = require('../entities/diagramToWorkflow');

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
    const diagram_to_workflow = new DiagramToWorkflowKnexPersist(this._db);
    return await this._db(this._table)
      .select('id', 'name', 'diagram_xml', 'blueprint_id','user_id', 'created_at', 
      'updated_at', 'aligned', 'workflow_id')
      .leftJoin(diagram_to_workflow._table, `${diagram_to_workflow._table}.diagram_id`, `${this._table}.id`)
      .orderBy('updated_at', 'desc');
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
    const diagram_to_workflow = new DiagramToWorkflowKnexPersist(this._db);
    return await this._db(this._table)
      .select('id', 'name', 'diagram_xml', 'blueprint_id','user_id', 'created_at', 
        'updated_at', 'aligned', 'workflow_id')
      .leftJoin(diagram_to_workflow._table, `${diagram_to_workflow._table}.diagram_id`, `${this._table}.id`)
      .where('user_id', user_id)
      .orderBy('updated_at', 'desc');
  }
  
  async getByWorkflowId(workflow_id) {
    const diagram_to_workflow = new DiagramToWorkflowKnexPersist(this._db);
    return await this._db(this._table)
      .select('id', 'name', 'diagram_xml', 'blueprint_id','user_id', 'created_at', 
        'updated_at', 'aligned', 'workflow_id')
      .join(diagram_to_workflow._table, `${diagram_to_workflow._table}.diagram_id`, `${this._table}.id`)
      .where('workflow_id', workflow_id)
      .orderBy('updated_at', 'desc');
  }
  
  async getLatestByWorkflowId(workflow_id) {
    const diagram_to_workflow = new DiagramToWorkflowKnexPersist(this._db);
    return await this._db(this._table)
      .select('id', 'name', 'diagram_xml', 'blueprint_id','user_id', 'created_at', 
        'updated_at', 'aligned', 'workflow_id')
      .join(diagram_to_workflow._table, `${diagram_to_workflow._table}.diagram_id`, `${this._table}.id`)
      .where('workflow_id', workflow_id)
      .orderBy('updated_at', 'desc')
      .first();
  }
  
  async getByUserAndWF(user_id, workflow_id) {
    const diagram_to_workflow = new DiagramToWorkflowKnexPersist(this._db);
    return await this._db(this._table)
      .select('id', 'name', 'diagram_xml', 'blueprint_id','user_id', 'created_at', 
        'updated_at', 'aligned', 'workflow_id')
      .join(diagram_to_workflow._table, `${diagram_to_workflow._table}.diagram_id`, `${this._table}.id`)
      .where('workflow_id', workflow_id)
      .andWhere('user_id', user_id)
      .orderBy('updated_at', 'desc');
  }
}

class BlueprintKnexPersist extends KnexPersist {
  constructor(db) {
    super(db, Blueprint, 'blueprints');
  }

  async save(blueprint) {
    await this._db(this._table).insert(blueprint);
    return 'create';
  }

  async update(id, blueprint_spec) {
    return await this._db(this._table).where('id', id)
      .update({ blueprint_spec })
      .returning('*');
  }
}

class WorkflowKnexPersist extends KnexPersist {
  constructor(db) {
    super(db, Workflow, 'workflows');
  }

  async save(workflow) {
    await this._db(this._table).insert(workflow);
    return 'create';
  }

  async update(id, workflow) {
    return await this._db(this._table).where('id', id)
      .update({ ...workflow })
      .returning('*');
  }
}

class DiagramToWorkflowKnexPersist extends KnexPersist {
  constructor(db) {
    super(db, DiagramToWorkflow, 'diagram_to_workflow');
  }

  async save(workflow) {
    await this._db(this._table).insert(workflow);
    return 'create';
  }

  async getDiagramIdsByWorkflowId(workflow_id) {
    return await this._db(this._table).select('*').where('workflow_id', workflow_id);
  }

  async getWorkflowIdsByDiagramId(diagram_id) {
    return await this._db(this._table).select('*').where('diagram_id', diagram_id);
  }

  async deleteByDiagramId(diagram_id) {
    return await this._db(this._table).where('diagram_id', diagram_id).del();
  }

  async deleteByWorkflowId(workflow_id) {
    return await this._db(this._table).where('workflow_id', workflow_id).del();
  }
}

module.exports = {
  DiagramKnexPersist,
  BlueprintKnexPersist,
  WorkflowKnexPersist,
  DiagramToWorkflowKnexPersist
}