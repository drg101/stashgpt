import type { Json } from "../global/global.types.ts";
import type { Prompt } from "../prompt/prompt.schema.ts";
import type { Response } from "../response/response.schema.ts";

export interface ModelInterface {
  evaluate: (options: ModelEvaluateOptions) => Promise<Response["response"]>;
}

export type ModelEvaluateOptions = {
  prompt: Prompt;
  input: Json;
};
