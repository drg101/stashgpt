import type {
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";

/** LLM Response itself */
export interface ResponseTable {
  // uuid
  id: Generated<string>;
  /** fk for Prompt */
  pid: string;
  /** pid$input hash for quick lookup */
  input_hash: string;

  /** Prompt input */
  input: JSONColumnType<object>;
  /** JSON response from model */
  response: JSONColumnType<object>;
}

export type Response = Selectable<ResponseTable>;
export type NewResponse = Insertable<ResponseTable>;
export type ResponseUpdate = Updateable<ResponseTable>;

/** LLM response usage */
export interface ResponseUsageTable {
  // uuid
  id: Generated<string>;
  /** fk for Response */
  rid: string;

  /** uid of user who used it */
  uid: string;

  /** timestamp of usage, ms */
  timestamp: number;
}

export type ResponseUsage = Selectable<ResponseUsageTable>;
export type NewResponseUsage = Insertable<ResponseUsageTable>;
export type ResponseUsageUpdate = Updateable<ResponseUsageTable>;
