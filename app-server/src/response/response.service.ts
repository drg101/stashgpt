import { Injectable } from "@nestjs/common";
import type { Prompt } from "../prompt/prompt.schema.ts";
import type { UtilService } from "../util/util.service.ts";
import { db } from "../db/db.ts";
import type { Response } from "./response.schema.ts";
import type { Json } from "../global/global.types.ts";

@Injectable()
export class ResponseService {
  constructor(private util: UtilService) {}

  async getResponse(options: {
    prompt: Prompt;
    input: Json;
    uid: string;
  }): Promise<Response["response"]> {
    const { prompt, input } = options;
    const inputHash = this.util.sha256(prompt.id, JSON.stringify(input));

    const existingResponse = await this.getResponseByInputHash(inputHash);

    if (existingResponse) {
      console.log("Cache hit for", existingResponse);
      return existingResponse.response;
    }
  }

  async getResponseByInputHash(hash: string) {
    return await db.selectFrom("response").where("input_hash", "=", hash)
      .selectAll()
      .executeTakeFirst();
  }
}
