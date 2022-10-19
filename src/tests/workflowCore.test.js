const { Workflow } = require('../entities/workflow');
const { DiagramToWorkflow } = require('../entities/diagramToWorkflow');
const { WorkflowCore } = require('../workflowCore');
const { DiagramToWorkflowCore } = require('../diagramToWorkflowCore');
const { validate } = require('uuid');
const { PersistorProvider } = require("../persist/provider");
const { db } = require('../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persistWorkflow = Workflow.getPersist();
  await persistWorkflow._db.destroy();
  const persistDiagramToWorkflow = DiagramToWorkflow.getPersist();
  await persistDiagramToWorkflow._db.destroy();
});

describe('WorkflowCore tests ', () => {

  test('constructor works', () => {
    const workflowCore = new WorkflowCore(db);
    expect(workflowCore).toBeInstanceOf(WorkflowCore);
  });
  
  test('create workflow', async () => {
    const workflowCore = new WorkflowCore(db);
    const workflowData = {
      id: '325c80a7-35c4-4af9-83b0-58e40af88b05',
      server: 'http://localhost:3000', 
      blueprint_id: '42a9a60e-e2e5-4d21-8e2f-67318b100e38'
    }
    const workflowCreated = await workflowCore.saveWorkflow(workflowData);
    expect(validate(workflowCreated.id)).toBeTruthy();
    expect(workflowCreated.server).toEqual('http://localhost:3000');
    expect(workflowCreated.blueprint_id).toEqual('42a9a60e-e2e5-4d21-8e2f-67318b100e38');
  });
  
  test('get workflow by id', async () => {
    const workflowCore = new WorkflowCore(db);
    const workflowFetched = await workflowCore.getWorkflowById('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(workflowFetched.id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(workflowFetched.server).toEqual('http://localhost:3000');
    expect(workflowFetched.blueprint_id).toEqual('42a9a60e-e2e5-4d21-8e2f-67318b100e38');
  });

  test('update workflow', async () => {
    const workflowCore = new WorkflowCore(db);
    const workflow = {
      server: 'http://localhost:5000',
      blueprint_id: '42a9a60e-e2e5-4d21-8e2f-67318b100e38'
    }
    const workflowUpdated = await workflowCore
      .updateWorkflow('325c80a7-35c4-4af9-83b0-58e40af88b05', workflow);
    expect(validate(workflowUpdated.id)).toBeTruthy();
    expect(workflowUpdated.server).toEqual('http://localhost:5000');
    expect(workflowUpdated.blueprint_id).toEqual('42a9a60e-e2e5-4d21-8e2f-67318b100e38');
  });

  test('delete workflow', async () => {
    const diagramToWorkflowCore = new DiagramToWorkflowCore(db);
    await diagramToWorkflowCore.deleteByWorkflowId('325c80a7-35c4-4af9-83b0-58e40af88b05');
    const workflowCore = new WorkflowCore(db);
    await workflowCore.deleteWorkflow('325c80a7-35c4-4af9-83b0-58e40af88b05');
    const workflowFetched = await workflowCore.getWorkflowById('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(workflowFetched).not.toBeTruthy();
  });
});
