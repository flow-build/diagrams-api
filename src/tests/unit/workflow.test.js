const { Workflow } = require('../../entities/workflow');
const { validate } = require('uuid');
const { PersistorProvider } = require('../../persist/provider');
const { db } = require('../../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persistWorkflow = Workflow.getPersist();
  await persistWorkflow._db.destroy();
});

describe('Workflow tests', () => {
  test('save workflow once', async () => {
    const workflowInstance = new Workflow(
      '325c80a7-35c4-4af9-83b0-58e40af88b05',
      'Workflow Test',
      1,
      '42a9a60e-e2e5-4d21-8e2f-67318b100e38',
      '1c8f314b-5421-40cb-9a5b-73fca821c88f'
    );
    const saved_workflow = await workflowInstance.save();
    expect(validate(saved_workflow.id)).toBeTruthy();
    expect(saved_workflow.id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(saved_workflow.name).toEqual('Workflow Test');
    expect(saved_workflow.version).toEqual(1);
    expect(saved_workflow.blueprint_id).toEqual(
      '42a9a60e-e2e5-4d21-8e2f-67318b100e38'
    );
  });

  test('fetch workflow by id', async () => {
    const fetched_workflow = await Workflow.fetch(
      '325c80a7-35c4-4af9-83b0-58e40af88b05'
    );
    expect(validate(fetched_workflow.id)).toBeTruthy();
    expect(fetched_workflow.id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(fetched_workflow.name).toEqual('Workflow Test');
    expect(fetched_workflow.version).toEqual(1);
    expect(fetched_workflow.blueprint_id).toEqual(
      '42a9a60e-e2e5-4d21-8e2f-67318b100e38'
    );
  });

  test('fetch workflows by server_id', async () => {
    const fetched_workflows = await Workflow.fetchWorkflowsByServer(
      '1c8f314b-5421-40cb-9a5b-73fca821c88f'
    );
    expect(fetched_workflows).toHaveLength(2);
    expect(fetched_workflows[0].id).toEqual(
      '325c80a7-35c4-4af9-83b0-58e40af88b05'
    );
    expect(fetched_workflows[0].name).toEqual('Workflow Test');
    expect(fetched_workflows[0].version).toEqual(1);
    expect(fetched_workflows[0].blueprint_id).toEqual(
      '42a9a60e-e2e5-4d21-8e2f-67318b100e38'
    );
  });

  test('delete workflows by server', async () => {
    await Workflow.deleteWorkflowsByServer(
      '1c8f314b-5421-40cb-9a5b-73fca821c88f'
    );
    const fetched_workflows = await Workflow.fetchWorkflowsByServer(
      '1c8f314b-5421-40cb-9a5b-73fca821c88f'
    );
    expect(fetched_workflows).toHaveLength(0);
  });
});
