import { Injectable } from "@nestjs/common";
import type { Prompt } from "../prompt/prompt.schema.ts";
import type { UtilService } from "../util/util.service.ts";
import { db } from "../db/db.ts";
import type {
  NewResponse,
  NewResponseUsage,
  Response,
} from "./response.schema.ts";
import type { Json } from "../global/global.types.ts";
import type { ModelService } from "../model/model.service.ts";
import { builtins as Types } from "pg-types";

@Injectable()
export class ResponseService {
  constructor(private util: UtilService, private model: ModelService) {}

  async getResponse(options: {
    prompt: Prompt;
    input: Json;
    uid: string;
  }): Promise<Response["response"]> {
    const { prompt, input } = options;
    const inputHash = this.util.sha256(`${prompt.id}`, JSON.stringify(input));

    const existingResponse = await this.getResponseByInputHash(inputHash);

    if (existingResponse) {
      console.log("Cache hit for", existingResponse);
      // do in the background
      this.createNewResponseUsage({
        uid: options.uid,
        rid: existingResponse.id,
        timestamp: Date.now(),
      });
      return existingResponse.response;
    }

    const raw_response = await this.model.evaluate({ prompt, input });

    const response = await this.createNewResponse({
      pid: prompt.id,
      input_hash: inputHash,
      input: JSON.stringify(input),
      response: JSON.stringify(raw_response),
    });
    console.log({ response });
    
    return raw_response;
  }

  async logResponseUsed(options: {
    uid: string;
    rid: Types.UUID;
  }) {
    await this.createNewResponseUsage({
      uid: options.uid,
      rid: options.rid,
      timestamp: Date.now(),
    });
  }

  async getResponseByInputHash(hash: string) {
    return await db.selectFrom("response").where("input_hash", "=", hash)
      .selectAll()
      .executeTakeFirst();
  }

  // Also return the the new response
  async createNewResponse(response: NewResponse) {
    return await db.insertInto("response")
      .values(response)
      .execute();
  }

  async createNewResponseUsage(responseUsage: NewResponseUsage) {
    return await db.insertInto("responseUsage")
      .values(responseUsage)
      .execute();
  }
}
