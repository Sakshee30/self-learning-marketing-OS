import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { Pool, type PoolClient } from "pg";
import { API_CONFIG, type ApiConfig } from "../config/api-config";

@Injectable()
export class DatabasePoolService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor(@Inject(API_CONFIG) config: ApiConfig) {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
      max: config.databasePoolMax,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 30_000,
    });
  }

  async transaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original failure. The pool will discard a broken client connection.
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
