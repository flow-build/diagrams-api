const { Diagram } = require('../../entities/diagram');
const { Blueprint } = require('../../entities/blueprint');
const { Workflow } = require('../../entities/workflow');
const { DiagramToWorkflow } = require('../../entities/diagramToWorkflow');
const { validate } = require('uuid');
const { PersistorProvider } = require("../../persist/provider");
const diagramExample = require('fs').readFileSync('./examples/diagram.xml', 'utf8');
const { db } = require('../../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persistDiagram = Diagram.getPersist();
  await persistDiagram._db.destroy();
  const persistWorkflow = Workflow.getPersist();
  await persistWorkflow._db.destroy();
  const persistBlueprint = Blueprint.getPersist();
  await persistBlueprint._db.destroy();
  const persistDiagramToWorkflow = DiagramToWorkflow.getPersist();
  await persistDiagramToWorkflow._db.destroy();
});

describe('Diagram tests (without workflow_id)', () => {

  test('saveDiagram', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    expect(validate(saved_diagram.id)).toBeTruthy();
    expect(saved_diagram.id).toEqual(diagram.id);
  });

  test('getAllDiagrams', async () => {
    const fetched_diagrams = await Diagram.fetchAll();
    expect(fetched_diagrams.length).toBeTruthy();
    expect(validate(fetched_diagrams[0].id)).toBeTruthy();
  });
  
  test('getDiagramsByUserId', async () => {
    const fetched_diagrams = await Diagram.fetchByUserId('1');
    expect(fetched_diagrams.length).toBeTruthy();
    expect(fetched_diagrams[0].user_id).toEqual('1');
  });
  
  test('getDiagramById', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    const fetched_diagram = await Diagram.fetch(saved_diagram.id);
    expect(validate(fetched_diagram.id)).toBeTruthy();
    expect(fetched_diagram.id).toEqual(saved_diagram.id);
  });

  test('updateDiagram', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    const updated_diagram = await Diagram.update(saved_diagram.id, {
      name: 'Update Diagram Test',
      blueprint_id: '42a9a60e-e2e5-4d21-8e2f-67318b100e38',
      aligned: false
    });
    expect(updated_diagram.blueprint_id).toEqual('42a9a60e-e2e5-4d21-8e2f-67318b100e38');
    expect(updated_diagram.name).toEqual('Update Diagram Test');
    expect(updated_diagram.aligned).toBeFalsy();
  });

  test('deleteDiagram', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    await Diagram.delete(saved_diagram.id);
    const fetched_diagram = await Diagram.fetch(saved_diagram.id);
    expect(fetched_diagram).not.toBeTruthy();
  });
  
});

describe('Diagram tests (with workflow_id)', () => {
  let saved_diagram;

  beforeAll(async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    saved_diagram = await diagram.save();
    const diagramToWorkflow = new DiagramToWorkflow(saved_diagram.id, '325c80a7-35c4-4af9-83b0-58e40af88b05');
    await diagramToWorkflow.save();
  });

  test('getDiagramsByWorkflowId', async () => {
    const fetched_diagrams = await Diagram.fetchByWorkflowId('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(fetched_diagrams.length).toBeTruthy();
    expect(fetched_diagrams[0].workflow_id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(fetched_diagrams[0].name).toEqual('Test');
  });

  test('getLatestDiagramByWorkflowId', async () => {
    const fetched_diagram = await Diagram.fetchLatestByWorkflowId('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(fetched_diagram.workflow_id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(fetched_diagram.name).toEqual('Test');
  });

  test('getDiagramsByUserAndWF', async () => {
    const fetched_diagrams = await Diagram.fetchByUserAndWF('1', '325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(fetched_diagrams.length).toBeTruthy();
    expect(fetched_diagrams[0].workflow_id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(fetched_diagrams[0].user_id).toEqual('1');
  });
})