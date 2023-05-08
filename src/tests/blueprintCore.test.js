const { BlueprintCore } = require('../blueprintCore');
const { WorkflowCore } = require('../workflowCore');
const { DiagramCore } = require('../diagramCore');
const { DiagramToWorkflowCore } = require('../diagramToWorkflowCore');
const { Blueprint } = require('../entities/blueprint');
const { Diagram } = require('../entities/diagram');
const { Workflow } = require('../entities/workflow');
const { DiagramToWorkflow } = require('../entities/diagramToWorkflow');
const { blueprint_spec } = require('../../examples/blueprint');
const { validate } = require('uuid');
const { PersistorProvider } = require("../persist/provider");
const { db } = require('../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persistBlueprint = Blueprint.getPersist();
  await persistBlueprint._db.destroy();
  const persistDiagram = Diagram.getPersist();
  await persistDiagram._db.destroy();
  const persistWorkflow = Workflow.getPersist();
  await persistWorkflow._db.destroy();
  const persistDiagramToWorkflow = DiagramToWorkflow.getPersist();
  await persistDiagramToWorkflow._db.destroy();
});

describe('BlueprintCore tests ', () => {
  test('constructor works', () => {
    const blueprintCore = new BlueprintCore(db);
    expect(blueprintCore).toBeInstanceOf(BlueprintCore);
  });
  
  test('create blueprint', async () => {
    const blueprintCore = new BlueprintCore(db);
    const blueprintCreated = await blueprintCore.saveBlueprint(blueprint_spec);
    expect(validate(blueprintCreated.id)).toBeTruthy();
  });
  
  test('get blueprint by id', async () => {
    const blueprintCore = new BlueprintCore(db);
    const blueprintCreated = await blueprintCore.saveBlueprint(blueprint_spec);
    const blueprint = await blueprintCore.getBlueprintById(blueprintCreated.id);
    expect(blueprint.id).toEqual(blueprintCreated.id);
    expect(blueprint.blueprint_spec).toBeDefined();
  });

  test('update blueprint', async () => {
    const blueprintCore = new BlueprintCore(db);
    const blueprintUpdated = await blueprintCore
      .updateBlueprint('42a9a60e-e2e5-4d21-8e2f-67318b100e38', blueprint_spec);
    expect(validate(blueprintUpdated.id)).toBeTruthy();
  });

  test('delete blueprint', async () => {
    const workflowCore = new WorkflowCore(db);
    const diagramCore = new DiagramCore(db);
    const diagramToWorkflowCore = new DiagramToWorkflowCore(db);
    const blueprintCore = new BlueprintCore(db);
    await diagramToWorkflowCore.deleteByDiagramId('d655538b-95d3-4627-acaf-b391fdc25142');
    await workflowCore.deleteWorkflow('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
    await diagramCore.deleteDiagram('d655538b-95d3-4627-acaf-b391fdc25142')
    await blueprintCore.deleteBlueprint('42a9a60e-e2e5-4d21-8e2f-67318b100e38');
    const blueprintFetched = await blueprintCore.getBlueprintById('42a9a60e-e2e5-4d21-8e2f-67318b100e38');
    expect(blueprintFetched).not.toBeTruthy();
  });
});
