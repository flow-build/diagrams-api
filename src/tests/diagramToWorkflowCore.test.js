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
  test('constructor works', () => {
    const diagramToWorkflowCore = new DiagramToWorkflowCore(db);
    expect(diagramToWorkflowCore).toBeInstanceOf(DiagramToWorkflowCore);
  });
  
  test('create diagramToWorkflow', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    const data_obj = { diagram_id: saved_diagram.id, workflow_id: '325c80a7-35c4-4af9-83b0-58e40af88b05' };
    const diagramToWorkflowCore = new DiagramToWorkflowCore(db);
    const diagramToWorkflowCreated = await diagramToWorkflowCore.saveDiagramToWorkflow(data_obj);
    expect(validate(diagramToWorkflowCreated.diagram_id)).toBeTruthy();
    expect(diagramToWorkflowCreated.diagram_id).toEqual(saved_diagram.id);
    expect(diagramToWorkflowCreated.workflow_id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
  });
  
  test('get workflow_id by diagram_id', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    const data_obj = { diagram_id: saved_diagram.id, workflow_id: '1051d8b0-5c53-4374-ad43-5dc0b483b8c2' };
    const diagramToWorkflowCore = new DiagramToWorkflowCore(db);
    await diagramToWorkflowCore.saveDiagramToWorkflow(data_obj)
    const workflowIdFetched = await diagramToWorkflowCore.getWorkflowIdByDiagramId(saved_diagram.id);
    expect(workflowIdFetched.diagram_id).toEqual(saved_diagram.id);
    expect(workflowIdFetched.workflow_id).toEqual('1051d8b0-5c53-4374-ad43-5dc0b483b8c2');
  });

  test('get diagram_id by workflow_id', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    const data_obj = { diagram_id: saved_diagram.id, workflow_id: '2253b5d5-6ab3-44fc-b857-f11c1adef981' };
    const diagramToWorkflowCore = new DiagramToWorkflowCore(db);
    await diagramToWorkflowCore.saveDiagramToWorkflow(data_obj)
    const diagramIdFetched = await diagramToWorkflowCore.getDiagramIdByWorkflowId('2253b5d5-6ab3-44fc-b857-f11c1adef981');
    expect(diagramIdFetched.diagram_id).toEqual(saved_diagram.id);
    expect(diagramIdFetched.workflow_id).toEqual('2253b5d5-6ab3-44fc-b857-f11c1adef981');
  });
});
