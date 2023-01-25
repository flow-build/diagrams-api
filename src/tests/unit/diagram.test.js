const { Diagram } = require('../../entities/diagram');
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

  test('getDiagramsByWorkflowId', async () => {
    const fetched_diagrams = await Diagram.fetchByWorkflowId('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f', '1');
    expect(fetched_diagrams.length).toBeTruthy();
    expect(fetched_diagrams[0].workflow_id).toEqual('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
    expect(fetched_diagrams[0].name).toEqual('Example Diagram');
  });

  test('getLatestDiagramByWorkflowId', async () => {
    const fetched_diagram = await Diagram.fetchLatestByWorkflowId('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f', '1');
    expect(fetched_diagram.workflow_id).toEqual('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
    expect(fetched_diagram.name).toEqual('Example Diagram');
  });

  test('getDiagramsByUserAndWF', async () => {
    const fetched_diagrams = await Diagram.fetchByUserAndWF('1', 'ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
    expect(fetched_diagrams.length).toBeTruthy();
    expect(fetched_diagrams[0].workflow_id).toEqual('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
    expect(fetched_diagrams[0].user_id).toEqual('1');
  });
})