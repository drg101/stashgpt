import { Injectable } from "@nestjs/common";
import { db } from "../db/db.ts";

@Injectable()
export class PromptService {
  async getPrompt(options: {
    prompt_name: string;
    prompt_version: string;
  }) {
    const { prompt_name, prompt_version } = options;
    return await db.selectFrom("prompt")
      .where("prompt_name", "=", prompt_name)
      .where("prompt_version", "=", prompt_version)
      .selectAll()
      .executeTakeFirst();
  }
}
