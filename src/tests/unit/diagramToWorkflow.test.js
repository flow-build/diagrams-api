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
    const diagramToWorkflow = new DiagramToWorkflow(saved_diagram.id, 'ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
    const saved_diagram_to_workflow = await diagramToWorkflow.save();
    expect(validate(saved_diagram_to_workflow.diagram_id)).toBeTruthy();
    expect(validate(saved_diagram_to_workflow.workflow_id)).toBeTruthy();
    expect(saved_diagram_to_workflow.diagram_id).toEqual(saved_diagram.id);
    expect(saved_diagram_to_workflow.workflow_id).toEqual('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
  });

  test('fetch workflow_ids by diagram_id', async () => {
    const fetched_workflow_ids = await DiagramToWorkflow.fetchWorkflowIdsByDiagramId(saved_diagram.id);
    expect(fetched_workflow_ids.length).toBeTruthy();
    expect(validate(fetched_workflow_ids[0].diagram_id)).toBeTruthy();
    expect(validate(fetched_workflow_ids[0].workflow_id)).toBeTruthy();

  });

  test('fetch diagram_ids by workflow_id', async () => {
    const fetched_diagram_ids = await DiagramToWorkflow.fetchDiagramIdsByWorkflowId('ae7e95f6-787a-4c0b-8e1a-4cc122e7d68f');
    expect(fetched_diagram_ids.length).toBeTruthy();
    expect(validate(fetched_diagram_ids[0].diagram_id)).toBeTruthy();
    expect(validate(fetched_diagram_ids[0].workflow_id)).toBeTruthy();
  });
});