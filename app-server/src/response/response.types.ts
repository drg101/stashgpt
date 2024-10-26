import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { jsonSchema } from "../global/global.types.ts";

const getResponseSchema = z.object({
  prompt_name: z.string(),
  prompt_version: z.string(),
  input: jsonSchema,
});
export class GetResponseDto extends createZodDto(getResponseSchema) {}
