const { Server } = require('../entities/server');
const { ServerCore } = require('../serverCore');
const { validate } = require('uuid');
const { PersistorProvider } = require("../persist/provider");
const { db } = require('../utils/db');

beforeAll(async () => {
  PersistorProvider.getPersistor(db);
  return db.raw('START TRANSACTION');
});

afterAll(async () => {
  await db.raw('ROLLBACK');
  const persistServer = Server.getPersist();
  await persistServer._db.destroy();
});

describe('ServerCore tests ', () => {

  test('constructor works', () => {
    const serverCore = new ServerCore(db);
    expect(serverCore).toBeInstanceOf(ServerCore);
  });
  
  test('create server', async () => {
    const serverCore = new ServerCore(db);
    const serverData = {
      url: 'https://flowbuild-homolog.com', 
      config: {
        namespace: 'homolog',
      },
    };
    const serverCreated = await serverCore.saveServer(serverData);
    expect(validate(serverCreated.id)).toBeTruthy();
    expect(serverCreated.url).toEqual('https://flowbuild-homolog.com');
    expect(serverCreated.config.namespace).toEqual('homolog');
  });
});