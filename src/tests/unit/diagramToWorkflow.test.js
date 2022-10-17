const { Diagram } = require('../../entities/diagram');
const diagramExample = require('fs').readFileSync('./examples/diagram.xml', 'utf8');
const { DiagramToWorkflow } = require('../../entities/diagramToWorkflow');
const { validate } = require('uuid');
const { PersistorProvider } = require("../../persist/provider");
const { db } = require('../../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persistDiagram = Diagram.getPersist();
  await persistDiagram._db.destroy();
  const persistDiagramToWorkflow = DiagramToWorkflow.getPersist();
  await persistDiagramToWorkflow._db.destroy();
});

describe('DiagramToWorkflow tests', () => {
  let saved_diagram;

  beforeAll(async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    saved_diagram = await diagram.save();
  });

  test('save diagram2workflow', async () => {
    const diagramToWorkflow = new DiagramToWorkflow(saved_diagram.id, '325c80a7-35c4-4af9-83b0-58e40af88b05');
    const saved_diagram_to_workflow = await diagramToWorkflow.save();
    expect(validate(saved_diagram_to_workflow.diagram_id)).toBeTruthy();
    expect(validate(saved_diagram_to_workflow.workflow_id)).toBeTruthy();
    expect(saved_diagram_to_workflow.diagram_id).toEqual(saved_diagram.id);
    expect(saved_diagram_to_workflow.workflow_id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
  });

  test('fetch workflow_id by diagram_id', async () => {
    const fetched_workflow_id = await DiagramToWorkflow.fetchWorkflowIdByDiagramId(saved_diagram.id);
    expect(validate(fetched_workflow_id.diagram_id)).toBeTruthy();
    expect(fetched_workflow_id.diagram_id).toEqual(saved_diagram.id);
    expect(fetched_workflow_id.workflow_id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
  });

  test('fetch diagram_id by workflow_id', async () => {
    const fetched_workflow_id = await DiagramToWorkflow.fetchDiagramIdByWorkflowId('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(validate(fetched_workflow_id.diagram_id)).toBeTruthy();
    expect(fetched_workflow_id.diagram_id).toEqual(saved_diagram.id);
    expect(fetched_workflow_id.workflow_id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
  });
});