const { Server } = require('../../entities/server');
const { PersistorProvider } = require('../../persist/provider');
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
  let serverId;

  test('save server', async () => {
    const serverInstance = new Server(
      'https://flowbuild-homolog.com',
      'homolog'
    );
    const saved_server = await serverInstance.save();
    serverId = saved_server.id;
    expect(saved_server.id).toBeDefined();
    expect(saved_server.namespace).toEqual('homolog');
  });

  test('fetchAll servers', async () => {
    const servers = await Server.fetchAll();
    expect(servers).toHaveLength(2);
    expect(servers[0].id).toBeDefined();
    expect(servers[0].url).toEqual('https://flowbuild-homolog.com');
    expect(servers[0].namespace).toEqual('homolog');
  });

  test('fetch server', async () => {
    const server = await Server.fetch(serverId);
    expect(server.id).toEqual(serverId);
    expect(server.url).toEqual('https://flowbuild-homolog.com');
    expect(server.namespace).toEqual('homolog');
  });

  test('update server', async () => {
    const last_sync = new Date();
    const server = await Server.update(serverId, { last_sync });
    expect(server.id).toEqual(serverId);
    expect(server.url).toEqual('https://flowbuild-homolog.com');
    expect(server.namespace).toEqual('homolog');
    expect(server.last_sync).toEqual(last_sync);
  });

  test('delete server', async () => {
    await Server.delete(serverId);
    const server = await Server.fetch(serverId);
    expect(server).toBeUndefined();
  });
});
