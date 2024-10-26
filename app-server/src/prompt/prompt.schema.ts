import type {
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";

export interface PromptTable {
  // uuid
  id: Generated<string>;

  /** ex: food_prompt */
  prompt_name: string;
  /** ex "2024-10-26", or "v1". prompt_id$prompt_version must be unique */
  prompt_version: string;

  /** Only google ai studio currently supported */
  provider: "google-ai";
  model: "gemini-1.5-flash-002";
  /** Default to 1 */
  temperature?: number;
  /** JSON schema is supported for gemini models */
  schema?: JSONColumnType<object>;

  /** supports handlebars format */
  system_prompt?: string;
  /** supports handlebars format */
  user_prompt: string;
}

export type Prompt = Selectable<PromptTable>;
export type NewPrompt = Insertable<PromptTable>;
export type PromptUpdate = Updateable<PromptTable>;
