const { Blueprint } = require('../../entities/blueprint');
const { validate } = require('uuid');
const { PersistorProvider } = require("../../persist/provider");
const { blueprint_spec } = require('../../../examples/blueprint');
const { db } = require('../../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persist = Blueprint.getPersist();
  await persist._db.destroy();
});

describe('Blueprint tests', () => {
  test('save blueprint', async () => {
    const blueprintInstance = new Blueprint(blueprint_spec);
    const saved_blueprint = await blueprintInstance.save();
    expect(saved_blueprint.id).toBeDefined();
    expect(saved_blueprint.blueprint_spec.lanes).toBeDefined();
    expect(saved_blueprint.blueprint_spec.nodes).toBeDefined();
    expect(saved_blueprint.blueprint_spec.environment).toBeUndefined();
  });

  test('save the same blueprint twice', async () => {
    const firstBlueprintInstance = new Blueprint(blueprint_spec);
    const firstSavedBlueprint = await firstBlueprintInstance.save();
    expect(validate(firstSavedBlueprint.id)).toBeTruthy();
    
    const secondBlueprintInstance = new Blueprint(blueprint_spec);
    const secondSavedBlueprint = await secondBlueprintInstance.save();
    expect(secondSavedBlueprint.id).toEqual(firstSavedBlueprint.id);
  });

  test('get blueprint by id', async () => {
    const blueprintInstance = new Blueprint(blueprint_spec);
    const saved_blueprint = await blueprintInstance.save();
    const fetched_blueprint = await Blueprint.fetch(saved_blueprint.id);
    expect(validate(fetched_blueprint.id)).toBeTruthy();
    expect(fetched_blueprint.id).toEqual(saved_blueprint.id);
    expect(saved_blueprint.blueprint_spec.lanes).toBeDefined();
    expect(saved_blueprint.blueprint_spec.nodes).toBeDefined();
    expect(saved_blueprint.blueprint_spec.environment).toBeUndefined();
  });
});