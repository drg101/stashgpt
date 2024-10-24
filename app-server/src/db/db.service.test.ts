// deno-lint-ignore-file no-explicit-any require-await
import { Test } from "@nestjs/testing";
import { DbService } from "./db.service.ts";
import { expect } from "@std/expect";
import { assertSpyCalls, spy } from "@std/testing/mock";

// Mock Pool and PoolClient
class MockPoolClient {
  queryObject = spy(async () => ({ rows: [] }));
  queryArray = spy(async () => ({ rows: [] }));
  release = spy(() => {});
}

class MockPool {
  private mockClient: MockPoolClient;

  constructor() {
    this.mockClient = new MockPoolClient();
  }

  connect = spy(async () => this.mockClient);
  end = spy(async () => {});
}

// Environment setup
const setupTestEnv = () => {
  Deno.env.set("DB_URL", "postgres://user:password@localhost:5432/test");
  Deno.env.set("DB_POOL_SIZE", "0"); 
};

Deno.test("DbService", async (t) => {
  setupTestEnv();

  await t.step("should initialize correctly", async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DbService],
    }).compile();

    const dbService = moduleRef.get(DbService);
    expect(dbService).toBeDefined();
  });

  await t.step("should connect on module init", async () => {
    const mockPool = new MockPool();
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DbService,
          useFactory: () => {
            const service = new DbService();
            // @ts-ignore - Replace the real pool with our mock
            service["pool"] = mockPool;
            return service;
          },
        },
      ],
    }).compile();

    const dbService = moduleRef.get(DbService);
    await dbService.onModuleInit();

    assertSpyCalls(mockPool.connect, 1);
  });

  await t.step("should execute queries successfully", async () => {
    const mockPool = new MockPool();
    const mockClient = new MockPoolClient();
    mockClient.queryObject = spy(async () => ({
      rows: [{ id: 1, name: "test" }],
    })) as any;
    mockPool.connect = spy(async () => mockClient);

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DbService,
          useFactory: () => {
            const service = new DbService();
            // @ts-ignore - Replace the real pool with our mock
            service["pool"] = mockPool;
            return service;
          },
        },
      ],
    }).compile();

    const dbService = moduleRef.get(DbService);
    const result = await dbService.query("SELECT * FROM test");

    expect(result).toEqual([{ id: 1, name: "test" }]);
    assertSpyCalls(mockClient.queryObject, 1);
    assertSpyCalls(mockClient.release, 1);
  });

  await t.step("should execute single row queries", async () => {
    const mockPool = new MockPool();
    const mockClient = new MockPoolClient();
    mockClient.queryObject = spy(async () => ({ rows: [{ id: 1 }] })) as any;
    mockPool.connect = spy(async () => mockClient);

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DbService,
          useFactory: () => {
            const service = new DbService();
            // @ts-ignore - Replace the real pool with our mock
            service["pool"] = mockPool;
            return service;
          },
        },
      ],
    }).compile();

    const dbService = moduleRef.get(DbService);
    const result = await dbService.queryOne(
      "SELECT * FROM test WHERE id = $1",
      [1],
    );

    expect(result).toEqual({ id: 1 });
    assertSpyCalls(mockClient.queryObject, 1);
  });

  await t.step("should handle transactions correctly", async () => {
    const mockPool = new MockPool();
    const mockClient = new MockPoolClient();
    mockPool.connect = spy(async () => mockClient);

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DbService,
          useFactory: () => {
            const service = new DbService();
            // @ts-ignore - Replace the real pool with our mock
            service["pool"] = mockPool;
            return service;
          },
        },
      ],
    }).compile();

    const dbService = moduleRef.get(DbService);
    await dbService.transaction(async (client) => {
      await client.queryArray("INSERT INTO test VALUES ($1)", [1]);
      return true;
    });

    assertSpyCalls(mockClient.queryArray, 3); // BEGIN + query + COMMIT
    assertSpyCalls(mockClient.release, 1);
  });

  await t.step("should clean up on module destroy", async () => {
    const mockPool = new MockPool();
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DbService,
          useFactory: () => {
            const service = new DbService();
            // @ts-ignore - Replace the real pool with our mock
            service["pool"] = mockPool;
            return service;
          },
        },
      ],
    }).compile();

    const dbService = moduleRef.get(DbService);
    await dbService.onModuleDestroy();

    assertSpyCalls(mockPool.end, 1);
  });
});
