exports.up = function (knex) {
  return knex.schema.createTable("diagram_to_workflow", (table) => {
    table.uuid("diagram_id").notNullable().unique();
    table.uuid("workflow_id").notNullable();
    table.foreign("diagram_id").references("diagrams.id");
    table.foreign("workflow_id").references("workflows.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("diagram_to_workflow");
};
