const { DiagramToWorkflowCore } = require('../diagramToWorkflowCore');
const { DiagramToWorkflow } = require('../entities/diagramToWorkflow');
const { Diagram } = require('../entities/diagram');
const diagramExample = require('fs').readFileSync('./examples/diagram.xml', 'utf8');
const { validate } = require('uuid');
const { PersistorProvider } = require("../persist/provider");
const { db } = require('../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persistDiagramToWorkflow = DiagramToWorkflow.getPersist();
  await persistDiagramToWorkflow._db.destroy();
  const persistDiagram = Diagram.getPersist();
  await persistDiagram._db.destroy();
});

describe('DiagramToWorkflowCore tests ', () => {
  let saved_diagram;

  beforeAll(async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    saved_diagram = await diagram.save();
  });
  
  test('constructor works', () => {
    const diagramToWorkflowCore = new DiagramToWorkflowCore(db);
    expect(diagramToWorkflowCore).toBeInstanceOf(DiagramToWorkflowCore);
  });
  
  test('create diagramToWorkflow', async () => {
    const data_obj = { diagram_id: saved_diagram.id, workflow_id: 'ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f' };
    const diagramToWorkflowCore = new DiagramToWorkflowCore(db);
    const diagramToWorkflowCreated = await diagramToWorkflowCore.saveDiagramToWorkflow(data_obj);
    expect(validate(diagramToWorkflowCreated.diagram_id)).toBeTruthy();
    expect(diagramToWorkflowCreated.diagram_id).toEqual(saved_diagram.id);
    expect(diagramToWorkflowCreated.workflow_id).toEqual('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
  });
  
  test('get workflow_id by diagram_id', async () => {
    const diagramToWorkflowCore = new DiagramToWorkflowCore(db);
    const workflowIdFetched = await diagramToWorkflowCore.getWorkflowIdByDiagramId(saved_diagram.id);
    expect(workflowIdFetched.diagram_id).toEqual(saved_diagram.id);
    expect(workflowIdFetched.workflow_id).toEqual('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
  });

  test('get diagram_ids by workflow_id', async () => {
    const diagramToWorkflowCore = new DiagramToWorkflowCore(db);
    const diagramIdsFetched = await diagramToWorkflowCore.getDiagramIdsByWorkflowId('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
    expect(diagramIdsFetched.length).toBeTruthy();
    expect(validate(diagramIdsFetched[0].diagram_id)).toBeTruthy();
  });
});
