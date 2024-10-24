import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Pool, PoolClient } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private client: PoolClient | null = null;

  constructor() {
    this.pool = new Pool(
      Deno.env.get("DB_URL"),
      parseInt(Deno.env.get("DB_POOL_SIZE") ?? "1"),
    );
  }

  async onModuleInit() {
    try {
      // Test the connection on startup
      this.client = await this.pool.connect();
      console.log("Database connection established successfully");
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
    } finally {
      if (this.client) {
        this.client.release();
      }
    }
  }

  async onModuleDestroy() {
    // Clean up connections when the application shuts down
    await this.pool.end();
    console.log("Database connections closed");
  }

  async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<T>(sql, params);
      return result.rows;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async queryOne<T>(sql: string, params?: unknown[]): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.queryArray("BEGIN");
      const result = await callback(client);
      await client.queryArray("COMMIT");
      return result;
    } catch (error) {
      await client.queryArray("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
