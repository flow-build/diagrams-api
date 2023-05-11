const { Server } = require('../entities/server');
const { ServerCore } = require('../../index');
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
  let serverCore = new ServerCore(db);
  let serverId;

  test('constructor works', () => {
    const serverCoreInstance = new ServerCore(db);
    expect(serverCoreInstance).toBeInstanceOf(ServerCore);
  });
  
  test('save server', async () => {
    const serverData = {
      url: 'https://flowbuild-homolog.com',
      namespace: 'homolog',
    };
    const serverCreated = await serverCore.saveServer(serverData);
    serverId = serverCreated.id;
    expect(validate(serverCreated.id)).toBeTruthy();
    expect(serverCreated.url).toEqual('https://flowbuild-homolog.com');
    expect(serverCreated.namespace).toEqual('homolog');
  });

  test('get all servers', async () => {
    const servers = await serverCore.getAllServers();
    expect(servers).toHaveLength(2);
    expect(validate(servers[0].id)).toBeTruthy();
    expect(servers[0].url).toEqual('https://flowbuild-homolog.com');
    expect(servers[0].namespace).toEqual('homolog');
  });

  test('get server', async () => {
    const server = await serverCore.getServer(serverId);
    expect(server.id).toEqual(serverId);
    expect(server.url).toEqual('https://flowbuild-homolog.com');
    expect(server.namespace).toEqual('homolog');
  });

  test('update server last sync', async () => {
    const lastSync = new Date();
    const serverUpdated = await serverCore.updateServer(serverId, { last_sync: lastSync });
    expect(serverUpdated.id).toEqual(serverId);
    expect(serverUpdated.url).toEqual('https://flowbuild-homolog.com');
    expect(serverUpdated.namespace).toEqual('homolog');
    expect(serverUpdated.last_sync).toEqual(lastSync);
  });
});