const { Diagram } = require('../entities/diagram');
const { DiagramCore } = require('../diagramCore');
const { validate } = require('uuid');
const { PersistorProvider } = require("../persist/provider");
const diagramExample = require('fs').readFileSync('./examples/diagram.xml', 'utf8');
const { db } = require('../utils/db');

const diagramPayload = {
  name: 'Test',
  user_id: '1',
  diagram_xml: diagramExample,
  workflow_id: '4e9ed734-7680-4a17-a05b-4c19ac920428',
  aligned: true
}

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
});

beforeEach(() => {
  return db.raw('START TRANSACTION');
});

afterEach(() => {
  return db.raw('ROLLBACK');
});

afterAll(async () => {
  const persist = Diagram.getPersist();
  await persist._db.destroy();
});

describe('DiagramCore tests', () => {
  test('constructor works', () => {
    const diagramCore = new DiagramCore(db);
    expect(diagramCore).toBeInstanceOf(DiagramCore);
  });
  
  test('create diagram', async () => {
    const diagramCore = new DiagramCore(db);
    const diagram = await diagramCore.saveDiagram(diagramPayload);
    expect(validate(diagram.id)).toBeTruthy();
    expect(diagram.name).toEqual('Test');
    expect(diagram.aligned).toBeTruthy();
  });
  
  test('get all diagram', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    const diagrams = await diagramCore.getAllDiagrams(diagramPayload);
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].id).toEqual(diagramCreated.id);
    expect(diagrams[0].aligned).toBeTruthy();
  });
  
  test('get diagrams by user_id', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    const diagrams = await diagramCore.getDiagramsByUserId('1');
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].user_id).toEqual(diagramCreated.user_id);
    expect(diagrams[0].user_id).toEqual('1');
    expect(diagrams[0].aligned).toBeTruthy();
  });
  
  test('get diagram by id', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    const diagram = await diagramCore.getDiagramById(diagramCreated.id);
    expect(diagram).toBeDefined();
  });
  
  test('get diagrams by workflow_id', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    const diagrams = await diagramCore.getDiagramsByWorkflowId('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].workflow_id).toEqual(diagramCreated.workflow_id);
    expect(diagrams[0].workflow_id).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagrams[0].aligned).toBeTruthy();
  });
  
  test('get latest diagram by workflow_id', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    const diagram = await diagramCore.getLatestDiagramByWorkflowId('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagram.workflow_id).toEqual(diagramCreated.workflow_id);
    expect(diagram.workflow_id).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagram.aligned).toBeTruthy();
  });
  
  test('get diagrams by user_id and workflow_id', async () => {
    const diagramCore = new DiagramCore(db);
    await diagramCore.saveDiagram(diagramPayload);
    const diagrams = await diagramCore.getDiagramsByUserAndWF('1', '4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].user_id).toEqual('1');
    expect(diagrams[0].workflow_id).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagrams[0].aligned).toBeTruthy();
  });
  
  test('update diagram', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    const diagramUpdated = await diagramCore.updateDiagram(diagramCreated.id, {
      name: 'Test Update'
    });
    expect(diagramUpdated.workflow_id).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagramUpdated.name).toEqual('Test Update');
    expect(diagramUpdated.aligned).toBeTruthy();
  });
  
  test('delete diagram', async () => {
    const diagramCore = new DiagramCore(db);
    const diagramCreated = await diagramCore.saveDiagram(diagramPayload);
    await diagramCore.deleteDiagram(diagramCreated.id);
    const diagram = await diagramCore.getDiagramById(diagramCreated.id)
    expect(diagram).not.toBeTruthy();
  });
})
