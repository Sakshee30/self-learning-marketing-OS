import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";
import { loadApiConfig } from "../src/config/api-config";

async function run() {
  const config = loadApiConfig();
  const pool = new Pool({ connectionString: config.databaseUrl, max: 1 });
  const client = await pool.connect();

  try {
    await client.query("SELECT pg_advisory_lock(hashtext($1))", ["growthos_website_api_migrations"]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS website_schema_migrations (
        name text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const migrationDirectory = path.resolve(process.cwd(), "migrations");
    const migrationNames = (await readdir(migrationDirectory))
      .filter((name) => name.endsWith(".sql"))
      .sort();

    for (const name of migrationNames) {
      const alreadyApplied = await client.query(
        "SELECT 1 FROM website_schema_migrations WHERE name = $1",
        [name],
      );
      if (alreadyApplied.rowCount) continue;

      const sql = await readFile(path.join(migrationDirectory, name), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO website_schema_migrations(name) VALUES ($1)", [name]);
        await client.query("COMMIT");
        process.stdout.write(`Applied ${name}\n`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    try {
      await client.query("SELECT pg_advisory_unlock(hashtext($1))", ["growthos_website_api_migrations"]);
    } finally {
      client.release();
      await pool.end();
    }
  }
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown migration failure";
  process.stderr.write(`Migration failed: ${message}\n`);
  process.exitCode = 1;
});
