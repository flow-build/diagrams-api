const { v4: uuid } = require('uuid'); 
const { Diagram } = require('../entities/diagram');
const { DiagramCore } = require('../diagramCore');
const { validate } = require('uuid');
const { PersistorProvider } = require("../persist/provider");
const diagramExample = require('fs').readFileSync('./examples/diagram.xml', 'utf8');
const { db } = require('../utils/db');
const { blueprint_spec } = require('../../examples/blueprint');
const _ = require('lodash')

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
    const payload = _.cloneDeep(diagramPayload)
    const diagramCreated = await diagramCore.saveDiagram(payload);
    const diagrams = await diagramCore.getDiagramsByUserId('1');
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].user_id).toEqual(diagramCreated.user_id);
    expect(diagrams[0].user_id).toEqual('1');
  });
  
  test('get diagram by id', async () => {
    const diagramCore = new DiagramCore(db);    
    const payload = _.cloneDeep(diagramPayload)
    const diagramCreated = await diagramCore.saveDiagram(payload);
    const diagram = await diagramCore.getDiagramById(diagramCreated.id);
    expect(diagram).toBeDefined();
  });
  
  test('update diagram', async () => {
    const diagramCore = new DiagramCore(db);
    const payload = _.cloneDeep(diagramPayload)
    const diagramCreated = await diagramCore.saveDiagram(payload);
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
    const payload = _.cloneDeep(diagramPayload)
    const diagramCreated = await diagramCore.saveDiagram(payload);
    await diagramCore.deleteDiagram(diagramCreated.id);
    const diagram = await diagramCore.getDiagramById(diagramCreated.id);
    expect(diagram).not.toBeTruthy();
  });
});

describe('DiagramCore tests (with workflow_id)', () => {
  test('create diagram', async () => {
    const diagramCore = new DiagramCore(db);
    const payload = _.cloneDeep(diagramPayload)
    payload.workflow_data = {
      id: uuid(),
      server: "vader.bunnyshell.com",
      blueprint_spec
    }
    const diagram = await diagramCore.saveDiagram(payload);
    expect(validate(diagram.id)).toBeTruthy();
    expect(diagram.name).toEqual('Test');
    expect(diagram.workflow_id).toBeDefined();
    expect(diagram.server).toBeDefined();
  });

  test('get diagrams by workflow_id', async () => {
    const diagramCore = new DiagramCore(db);
    const payload = _.cloneDeep(diagramPayload)
    const workflowId = uuid()
    payload.workflow_data = {
      id: workflowId,
      server: "vader.bunnyshell.com",
      blueprint_spec
    }
    const diagram = await diagramCore.saveDiagram(payload);
    const diagrams = await diagramCore.getDiagramsByWorkflowId(workflowId, '1');
    expect(diagrams.length).toEqual(1);
    expect(diagrams[0].id).toEqual(diagram.id);
  });
  
  test('get latest diagram by workflow_id', async () => {
    const diagramCore = new DiagramCore(db);
    const payload = _.cloneDeep(diagramPayload)
    const workflowId = uuid()
    payload.workflow_data = {
      id: workflowId,
      server: "vader.bunnyshell.com",
      blueprint_spec
    }
    const diagram = await diagramCore.saveDiagram(payload);
    const result = await diagramCore.getLatestDiagramByWorkflowId(workflowId, '1');
    expect(result.id).toEqual(diagram.id);
  });
  
  test('get diagrams by user_id and workflow_id', async () => {
    const diagramCore = new DiagramCore(db);
    const diagrams = await diagramCore.getDiagramsByUserAndWF('1', 'ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].user_id).toEqual('1');
    expect(diagrams[0].workflow_id).toEqual('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
  });
});

describe('DiagramCore tests (public diagrams)', () => {
  test('create diagram', async () => {
    const diagramCore = new DiagramCore(db);
    const payload = _.cloneDeep(diagramPayload)
    payload.workflow_data = {
      id: uuid(),
      server: "vader.bunnyshell.com",
      blueprint_spec
    }
    payload.isPublic = true;
    const diagram = await diagramCore.saveDiagram(payload);
    expect(validate(diagram.id)).toBeTruthy();
    expect(diagram.name).toEqual('Test');
    expect(diagram.workflow_id).toBeDefined();
    expect(diagram.server).toBeDefined();
    expect(diagram.user_id).toBeNull();
  });

  test('get diagrams by workflow_id', async () => {
    const diagramCore = new DiagramCore(db);
    const payload = _.cloneDeep(diagramPayload)
    const workflowId = uuid()
    payload.workflow_data = {
      id: workflowId,
      server: "vader.bunnyshell.com",
      blueprint_spec
    }
    payload.isPublic = true;
    const diagram = await diagramCore.saveDiagram(payload);
    const diagrams = await diagramCore.getDiagramsByWorkflowId(workflowId);
    expect(diagrams.length).toEqual(1);
    expect(diagrams[0].id).toEqual(diagram.id);
  });
  
  test('get latest diagram by workflow_id', async () => {
    const diagramCore = new DiagramCore(db);
    const payload = _.cloneDeep(diagramPayload)
    const workflowId = uuid()
    payload.workflow_data = {
      id: workflowId,
      server: "vader.bunnyshell.com",
      blueprint_spec
    }
    payload.isPublic = true;
    const diagram = await diagramCore.saveDiagram(payload);
    const result = await diagramCore.getLatestDiagramByWorkflowId(workflowId);
    expect(result.id).toEqual(diagram.id);
  });
});