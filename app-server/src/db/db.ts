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
  pool: new Pool(Deno.env.get("DB_URL")),
});

export const db = new Kysely<Database>({
  dialect,
});
