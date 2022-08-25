const { Diagram } = require('../../entities/diagram');
const { validate } = require('uuid');
const { PersistorProvider } = require("../../persist/provider");
const diagramExample = require('fs').readFileSync('./examples/diagram.xml', 'utf8');
const { db } = require('../../utils/db');

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

describe('Diagram tests', () => {
  test('saveDiagram', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    expect(validate(saved_diagram.id)).toBeTruthy();
    expect(saved_diagram.id).toEqual(diagram.id);
  });

  test('getAllDiagrams', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    const fetched_diagrams = await Diagram.fetchAll();
    expect(fetched_diagrams.length).toBeTruthy();
    expect(fetched_diagrams[0].id).toEqual(saved_diagram.id);
  });
  
  test('getDiagramsByUserId', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    await diagram.save();
    const fetched_diagrams = await Diagram.fetchByUserId('1');
    expect(fetched_diagrams.length).toBeTruthy();
    expect(fetched_diagrams[0].user_id).toEqual('1');
  });
  
  test('getDiagramById', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    const fetched_diagram = await Diagram.fetch(saved_diagram.id);
    expect(validate(fetched_diagram.id)).toBeTruthy();
    expect(fetched_diagram.id).toEqual(saved_diagram.id);
  });

  test('getDiagramsByWorkflowId', async () => {
    const diagram = new Diagram('Test', '1', diagramExample, '4e9ed734-7680-4a17-a05b-4c19ac920428');
    const saved_diagram = await diagram.save();
    const fetched_diagrams = await Diagram.fetchByWorkflowId('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(fetched_diagrams.length).toBeTruthy();
    expect(saved_diagram.workflow_id).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(fetched_diagrams[0].workflow_id).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
  });

  test('getLatestDiagramByWorkflowId', async () => {
    const diagram = new Diagram('Test', '1', diagramExample, '4e9ed734-7680-4a17-a05b-4c19ac920428');
    const saved_diagram = await diagram.save();
    const fetched_diagram = await Diagram.fetchLatestByWorkflowId('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(saved_diagram.workflow_id).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(fetched_diagram.workflow_id).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
  });

  test('getDiagramsByUserAndWF', async () => {
    const diagram = new Diagram('Test', '1', diagramExample, '4e9ed734-7680-4a17-a05b-4c19ac920428');
    await diagram.save();
    const fetched_diagrams = await Diagram.fetchByUserAndWF('1', '4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(fetched_diagrams.length).toBeTruthy();
    expect(fetched_diagrams[0].workflow_id).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(fetched_diagrams[0].user_id).toEqual('1');
  });

  test('updateDiagram', async () => {
    const diagram = new Diagram('Test', '1', diagramExample, '4e9ed734-7680-4a17-a05b-4c19ac920428');
    const saved_diagram = await diagram.save();
    const updated_diagram = await Diagram.update(saved_diagram.id, {
      name: 'Update Diagram Test'
    });
    expect(updated_diagram.workflow_id).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(updated_diagram.name).toEqual('Update Diagram Test');
  });

  test('deleteDiagram', async () => {
    const diagram = new Diagram('Test', '1', diagramExample);
    const saved_diagram = await diagram.save();
    await Diagram.delete(saved_diagram.id);
    const fetched_diagram = await Diagram.fetch(saved_diagram.id);
    expect(fetched_diagram).not.toBeTruthy();
  });
  
});