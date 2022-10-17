const { Diagram } = require('../entities/diagram');
const { DiagramToWorkflow } = require('../entities/diagramToWorkflow');
const { DiagramCore } = require('../diagramCore');
const { validate } = require('uuid');
const { PersistorProvider } = require("../persist/provider");
const diagramExample = require('fs').readFileSync('./examples/diagram.xml', 'utf8');
const { db } = require('../utils/db');

const diagramPayload = {
  name: 'Test',
  user_id: '1',
  diagram_xml: diagramExample
}

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persist = Diagram.getPersist();
  await persist._db.destroy();
});

describe('DiagramCore tests (without workflow_id)', () => {
  test('constructor works', () => {
    const diagramCore = new DiagramCore(db);
    expect(diagramCore).toBeInstanceOf(DiagramCore);
  });
  
  test('create diagram', async () => {
    const diagramCore = new DiagramCore(db);
    const diagram = await diagramCore.saveDiagram(diagramPayload);
    expect(validate(diagram.id)).toBeTruthy();
    expect(diagram.name).toEqual('Test');
  });
  
  test('get all diagrams', async () => {
    const diagramCore = new DiagramCore(db);
    diagramCore.saveDiagram(diagramPayload);
    const diagrams = await diagramCore.getAllDiagrams(diagramPayload);
    expect(diagrams.length).toBeTruthy();
  });
  
  test('get diagrams by user_id', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    const diagrams = await diagramCore.getDiagramsByUserId('1');
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].user_id).toEqual(diagramCreated.user_id);
    expect(diagrams[0].user_id).toEqual('1');
  });
  
  test('get diagram by id', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    const diagram = await diagramCore.getDiagramById(diagramCreated.id);
    expect(diagram).toBeDefined();
  });
  
  test('update diagram', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    const diagramUpdated = await diagramCore.updateDiagram(diagramCreated.id, {
      name: 'Test Update',
      blueprint_id: '42a9a60e-e2e5-4d21-8e2f-67318b100e38',
      aligned: true
    });
    expect(diagramUpdated.blueprint_id).toEqual('42a9a60e-e2e5-4d21-8e2f-67318b100e38');
    expect(diagramUpdated.name).toEqual('Test Update');
    expect(diagramUpdated.aligned).toBeTruthy();
  });
  
  test('delete diagram', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    await diagramCore.deleteDiagram(diagramCreated.id);
    const diagram = await diagramCore.getDiagramById(diagramCreated.id)
  });
});

describe('DiagramCore tests (with workflow_id)', () => {
  let diagramCore;

  beforeAll(async () => {
    diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    const diagramToWorkflow = new DiagramToWorkflow(diagramCreated.id, '325c80a7-35c4-4af9-83b0-58e40af88b05');
    await diagramToWorkflow.save();
  });

  test('get diagrams by workflow_id', async () => {
    const diagrams = await diagramCore.getDiagramsByWorkflowId('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].workflow_id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
  });
  
  test('get latest diagram by workflow_id', async () => {
    const diagram = await diagramCore.getLatestDiagramByWorkflowId('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(diagram.workflow_id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
  });
  
  test('get diagrams by user_id and workflow_id', async () => {
    const diagrams = await diagramCore.getDiagramsByUserAndWF('1', '325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].user_id).toEqual('1');
    expect(diagrams[0].workflow_id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
  });
});
