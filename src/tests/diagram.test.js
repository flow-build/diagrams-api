const Diagram = require('../diagram');
const { validate } = require('uuid');
const diagramExample = require('fs').readFileSync('./examples/diagram.xml', 'utf8');
const { db } = require('../utils/db');

afterAll(async () => {
  await db.destroy();
});

let diagramId;

describe('Diagram tests', () => {
  test('saveDiagram', async () => {
    const diagram = await Diagram.saveDiagram({
      name: 'Save Diagram Test',
      user_id: '1',
      diagram_xml: diagramExample,
      workflow_id: '4e9ed734-7680-4a17-a05b-4c19ac920428'
    });
    diagramId = diagram.id;
    expect(diagram).toBeDefined();
    expect(validate(diagram.id)).toBeTruthy();
    expect(diagram.workflowId).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
  });

  test('getAllDiagrams', async () => {
    const diagrams = await Diagram.getAllDiagrams();
    expect(diagrams).toBeDefined();
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].userId).toEqual('1');
  });
  
  test('getDiagramsByUserId', async () => {
    const diagrams = await Diagram.getDiagramsByUserId('1');
    expect(diagrams).toBeDefined();
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].userId).toEqual('1');
  });
  
  test('getDiagramById', async () => {
    const diagram = await Diagram.getDiagramById(diagramId);
    expect(diagram).toBeDefined();
    expect(diagram.id).toEqual(diagramId);
  });

  test('getDiagramsByWorkflowId', async () => {
    const diagrams = await Diagram.getDiagramsByWorkflowId('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagrams).toBeDefined();
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].workflowId).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
  });

  test('getLatestDiagramByWorkflowId', async () => {
    const diagram = await Diagram.getLatestDiagramByWorkflowId('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagram).toBeDefined();
    expect(diagram.workflowId).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
  });

  test('getDiagramsByUserAndWF', async () => {
    const diagrams = await Diagram.getDiagramsByUserAndWF('1', '4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagrams).toBeDefined();
    expect(diagrams.length).toBeTruthy();
    expect(diagrams[0].workflowId).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagrams[0].userId).toEqual('1');
  });

  test('updateDiagram', async () => {
    const diagram = await Diagram.updateDiagram(diagramId, {
      name: 'Update Diagram Test'
    });
    expect(diagram).toBeDefined();
    expect(diagram.workflowId).toEqual('4e9ed734-7680-4a17-a05b-4c19ac920428');
    expect(diagram.name).toEqual('Update Diagram Test');
  });

  test('deleteDiagram', async () => {
    const diagramDeleted = await Diagram.deleteDiagram(diagramId);
    const diagram = await Diagram.getDiagramById(diagramId);

    expect(diagramDeleted).toBeDefined();
    expect(diagramDeleted.id).toEqual(diagramId);
    expect(diagram).not.toBeTruthy();
  });
  
});