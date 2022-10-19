const { Workflow } = require('../../entities/workflow');
const { validate } = require('uuid');
const { PersistorProvider } = require("../../persist/provider");
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

  test('save workflow', async () => {
    const workflowInstance = new Workflow('325c80a7-35c4-4af9-83b0-58e40af88b05',
      'http://localhost:3000', '42a9a60e-e2e5-4d21-8e2f-67318b100e38');
    const saved_workflow = await workflowInstance.save();
    expect(validate(saved_workflow.id)).toBeTruthy();
    expect(saved_workflow.id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(saved_workflow.server).toEqual('http://localhost:3000');
    expect(saved_workflow.blueprint_id).toEqual('42a9a60e-e2e5-4d21-8e2f-67318b100e38');
  });

  test('fetch workflow by id', async () => {
    const fetched_workflow = await Workflow.fetch('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(validate(fetched_workflow.id)).toBeTruthy();
    expect(fetched_workflow.id).toEqual('325c80a7-35c4-4af9-83b0-58e40af88b05');
    expect(fetched_workflow.server).toEqual('http://localhost:3000');
    expect(fetched_workflow.blueprint_id).toEqual('42a9a60e-e2e5-4d21-8e2f-67318b100e38');
  });
});