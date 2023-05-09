const { Diagram } = require("../entities/diagram");
const { Blueprint } = require("../entities/blueprint");
const { Workflow } = require("../entities/workflow");
const { Server } = require("../entities/server");

class KnexPersist {
  constructor(db, class_, table) {
    this._db = db;
    this._class = class_;
    this._table = table;
  }

  async delete(obj_id) {
    return await this._db(this._table).where("id", obj_id).del();
  }

  async get(obj_id) {
    return await this._db.select("*").from(this._table).where("id", obj_id).first();
  }
}

class DiagramKnexPersist extends KnexPersist {
  constructor(db) {
    super(db, Diagram, "diagram");
  }

  async getAll() {
    const workflow = new WorkflowKnexPersist(this._db);
    return await this._db(this._table)
      .leftJoin(workflow._table, `${workflow._table}.blueprint_id`, `${this._table}.blueprint_id`)
      .select(
        "diagram.id",
        "diagram.name",
        "diagram_xml",
        "diagram.blueprint_id",
        "diagram.user_id",
        "diagram.created_at",
        "diagram.updated_at",
        "is_aligned",
        "workflow.id as worflow_id",
      )
      .orderBy("updated_at", "desc");
  }

  async save(diagram) {
    await this._db(this._table).insert(diagram);
    return "create";
  }

  async update(diagram_id, diagram) {
    return await this._db(this._table)
      .where("id", diagram_id)
      .update({ ...diagram, updated_at: "now" })
      .returning("*");
  }

  async delete(id) {
    await this._db(this._table).where("id", id).del();
  }

  async getByUserId(user_id) {
    const workflow = new WorkflowKnexPersist(this._db);
    return await this._db(this._table)
      .leftJoin(workflow._table, `${workflow._table}.blueprint_id`, `${this._table}.blueprint_id`)
      .select(
        "diagram.id",
        "diagram.name",
        "diagram_xml",
        "diagram.blueprint_id",
        "diagram.user_id",
        "diagram.created_at",
        "diagram.updated_at",
        "is_aligned",
        "workflow.id as workflow_id"
      )
      .where("user_id", user_id)
      .orderBy("diagram.updated_at", "desc");
  }

  async getByWorkflowId(workflow_id) {
    const workflow = new WorkflowKnexPersist(this._db);
    return await this._db(this._table)
      .leftJoin(workflow._table, `${workflow._table}.blueprint_id`, `${this._table}.blueprint_id`)
      .select(
        "diagram.id",
        "diagram.name",
        "diagram_xml",
        "diagram.blueprint_id",
        "user_id",
        "diagram.created_at",
        "diagram.updated_at",
        "is_aligned",
        "workflow.id as workflow_id"
      )
      .where("workflow.id", workflow_id)
      .orderBy("diagram.updated_at", "desc");
  }

  async getLatestByWorkflowId(workflow_id) {
    const workflows = await this.getByWorkflowId(workflow_id);
    return workflows[0];
  }

  async getByUserAndWF(user_id, workflow_id) {
    const workflow = new WorkflowKnexPersist(this._db);
    return await this._db(this._table)
      .leftJoin(workflow._table, `${workflow._table}.blueprint_id`, `${this._table}.blueprint_id`)
      .select(
        "diagram.id",
        "diagram.name",
        "diagram_xml",
        "diagram.blueprint_id",
        "user_id",
        "diagram.created_at",
        "diagram.updated_at",
        "is_aligned",
        "workflow.id as workflow_id"
      )
      .where({ user_id: user_id, "workflow.id": workflow_id })
      .orderBy("diagram.updated_at", "desc");
  }
}

class BlueprintKnexPersist extends KnexPersist {
  constructor(db) {
    super(db, Blueprint, "blueprint");
  }

  async save(blueprint) {
    let result;
    result = await this._db(this._table).where('blueprint_spec', blueprint.blueprint_spec);
    if (result.length === 0) {
      const insertResult = await this._db(this._table).insert(blueprint).returning('*');
      return insertResult[0];
    } else {
      return result[0];
    }
  }

  async update(id, blueprint_spec) {
    return await this._db(this._table).where("id", id).update({ blueprint_spec }).returning("*");
  }
}

class WorkflowKnexPersist extends KnexPersist {
  constructor(db) {
    super(db, Workflow, "workflow");
  }

  async save(workflow) {
    await this._db(this._table).insert(workflow);  
    return "create";
  }

  async update(id, workflow) {
    return await this._db(this._table)
      .where("id", id)
      .update({ ...workflow })
      .returning("*");
  }
}

class ServerKnexPersist extends KnexPersist {
  constructor(db) {
    super(db, Server, "server");
  }

  async save(server) {
    await this._db(this._table).insert(server);
    return "create";
  }
}

module.exports = {
  DiagramKnexPersist,
  BlueprintKnexPersist,
  WorkflowKnexPersist,
  ServerKnexPersist,
};
