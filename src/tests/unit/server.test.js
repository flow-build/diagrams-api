const { Server } = require('../../entities/server');
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

  test('error trying to save the same url twice', async () => {
    await expect(async () => {
      const serverInstance = new Server('https://flowbuild-homolog.com', { namespace: 'homolog' });
      await serverInstance.save();
    }).rejects.toBeInstanceOf(Error);
  });
});