import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import type { PromptTable } from "../prompt/prompt.schema.ts";
import type {
  ResponseTable,
  ResponseUsageTable,
} from "../response/response.schema.ts";
import ws from "ws";

// Main db table
export interface Database {
  prompt: PromptTable;
  response: ResponseTable;
  responseusage: ResponseUsageTable;
}

export const db = new Kysely<Database>({
  dialect: new NeonDialect({
    connectionString: Deno.env.get("DATABASE_URL"),
    webSocketConstructor: ws,
  }),
});
