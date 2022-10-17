const { BlueprintCore } = require('../blueprintCore');
const { Blueprint } = require('../entities/blueprint');
const blueprintSample = require('../../examples/blueprint');
const { validate } = require('uuid');
const { PersistorProvider } = require("../persist/provider");
const { db } = require('../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persist = Blueprint.getPersist();
  await persist._db.destroy();
});

describe('BlueprintCore tests ', () => {
  test('constructor works', () => {
    const blueprintCore = new BlueprintCore(db);
    expect(blueprintCore).toBeInstanceOf(BlueprintCore);
  });
  
  test('create blueprint', async () => {
    const blueprintCore = new BlueprintCore(db);
    const blueprintCreated = await blueprintCore.saveBlueprint(blueprintSample);
    expect(validate(blueprintCreated.id)).toBeTruthy();
    expect(blueprintCreated.blueprint_spec).toEqual(blueprintSample.blueprint_spec);
  });
  
  test('get blueprint by id', async () => {
    const blueprintCore = new BlueprintCore(db);
    const blueprintCreated = await blueprintCore.saveBlueprint(blueprintSample);
    const blueprint = await blueprintCore.getBlueprintById(blueprintCreated.id);
    expect(blueprint.id).toEqual(blueprintCreated.id);
    expect(blueprint.blueprint_spec).toEqual(blueprintCreated.blueprint_spec);
  });
});
