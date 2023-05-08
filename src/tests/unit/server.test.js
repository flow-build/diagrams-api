const { Server } = require('../../entities/server');
const { validate } = require('uuid');
const { PersistorProvider } = require("../../persist/provider");
const { db } = require('../../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persist = Server.getPersist();
  await persist._db.destroy();
});

describe('Server tests', () => {
  test('save server', async () => {
    const serverInstance = new Server('https://flowbuild-homolog.com', { namespace: 'homolog' });
    const saved_server = await serverInstance.save();
    expect(saved_server.id).toBeDefined();
    expect(saved_server.event_broker.namespace).toEqual('homolog');
  });

  // test('save the same blueprint twice', async () => {
  //   const firstBlueprintInstance = new Blueprint(blueprint_spec);
  //   const firstSavedBlueprint = await firstBlueprintInstance.save();
  //   expect(validate(firstSavedBlueprint.id)).toBeTruthy();
    
  //   const secondBlueprintInstance = new Blueprint(blueprint_spec);
  //   const secondSavedBlueprint = await secondBlueprintInstance.save();
  //   expect(secondSavedBlueprint.id).toEqual(firstSavedBlueprint.id);
  // });

  // test('get blueprint by id', async () => {
  //   const blueprintInstance = new Blueprint(blueprint_spec);
  //   const saved_blueprint = await blueprintInstance.save();
  //   const fetched_blueprint = await Blueprint.fetch(saved_blueprint.id);
  //   expect(validate(fetched_blueprint.id)).toBeTruthy();
  //   expect(fetched_blueprint.id).toEqual(saved_blueprint.id);
  //   expect(saved_blueprint.blueprint_spec.lanes).toBeDefined();
  //   expect(saved_blueprint.blueprint_spec.nodes).toBeDefined();
  //   expect(saved_blueprint.blueprint_spec.environment).toBeUndefined();
  // });
});