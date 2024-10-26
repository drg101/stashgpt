import Pool from "pg-pool";
import { Kysely, PostgresDialect } from "kysely";
import type { PromptTable } from "../prompt/prompt.schema.ts";
import type {
  ResponseTable,
  ResponseUsageTable,
} from "../response/response.schema.ts";

// Main db table
export interface Database {
  prompt: PromptTable;
  response: ResponseTable;
  responseUsage: ResponseUsageTable;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: Deno.env.get('PGDATABASE'),
    host: Deno.env.get('PGHOST'),
    user: Deno.env.get('PGUSER'),
    password: Deno.env.get('PGPASSWORD'),
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
