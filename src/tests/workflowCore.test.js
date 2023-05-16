const { Workflow } = require('../entities/workflow');
const { WorkflowCore } = require('../../index');
const { validate } = require('uuid');
const { PersistorProvider } = require('../persist/provider');
const { db } = require('../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persistWorkflow = Workflow.getPersist();
  await persistWorkflow._db.destroy();
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
      name: 'Workflow Test',
      version: 1,
      server_id: '1c8f314b-5421-40cb-9a5b-73fca821c88f',
      blueprint_id: '42a9a60e-e2e5-4d21-8e2f-67318b100e38',
    };
    const workflowCreated = await workflowCore.saveWorkflow(workflowData);
    expect(validate(workflowCreated.id)).toBeTruthy();
    expect(workflowCreated.name).toEqual('Workflow Test');
    expect(workflowCreated.blueprint_id).toEqual(
      '42a9a60e-e2e5-4d21-8e2f-67318b100e38'
    );
  });

  test('get workflow by id', async () => {
    const workflowCore = new WorkflowCore(db);
    const workflowFetched = await workflowCore.getWorkflowById(
      '325c80a7-35c4-4af9-83b0-58e40af88b05'
    );
    expect(workflowFetched.id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(workflowFetched.name).toEqual('Workflow Test');
    expect(workflowFetched.blueprint_id).toEqual(
      '42a9a60e-e2e5-4d21-8e2f-67318b100e38'
    );
  });

  test('get workflows by server', async () => {
    const workflowCore = new WorkflowCore(db);
    const workflowsFetched = await workflowCore.getWorkflowsByServer(
      '1c8f314b-5421-40cb-9a5b-73fca821c88f'
    );
    expect(workflowsFetched).toHaveLength(2);
    expect(workflowsFetched[0].id).toEqual(
      '325c80a7-35c4-4af9-83b0-58e40af88b05'
    );
    expect(workflowsFetched[0].name).toEqual('Workflow Test');
    expect(workflowsFetched[0].blueprint_id).toEqual(
      '42a9a60e-e2e5-4d21-8e2f-67318b100e38'
    );
  });

  test('update workflow', async () => {
    const workflowCore = new WorkflowCore(db);
    const workflow = {
      name: 'Update Workflow',
      version: 2,
    };
    const workflowUpdated = await workflowCore.updateWorkflow(
      '325c80a7-35c4-4af9-83b0-58e40af88b05',
      workflow
    );
    expect(validate(workflowUpdated.id)).toBeTruthy();
    expect(workflowUpdated.name).toEqual('Update Workflow');
    expect(workflowUpdated.version).toEqual(2);
  });

  test('delete workflow', async () => {
    const workflowCore = new WorkflowCore(db);
    await workflowCore.deleteWorkflow('325c80a7-35c4-4af9-83b0-58e40af88b05');
    const workflowFetched = await workflowCore.getWorkflowById(
      '325c80a7-35c4-4af9-83b0-58e40af88b05'
    );
    expect(workflowFetched).not.toBeTruthy();
  });

  test('delete workflows by server', async () => {
    const workflowCore = new WorkflowCore(db);
    const workflowData = {
      id: '2a23b450-e46b-11ed-99b5-9be1e7057c57',
      name: 'Workflow Server Test',
      version: 1,
      server_id: '1c8f314b-5421-40cb-9a5b-73fca821c88f',
      blueprint_id: '42a9a60e-e2e5-4d21-8e2f-67318b100e38',
    };
    await workflowCore.saveWorkflow(workflowData);
    await workflowCore.deleteWorkflowsByServer(
      '1c8f314b-5421-40cb-9a5b-73fca821c88f'
    );
    const workflowsFetched = await workflowCore.getWorkflowsByServer(
      '1c8f314b-5421-40cb-9a5b-73fca821c88f'
    );
    expect(workflowsFetched).toHaveLength(0);
  });
});
