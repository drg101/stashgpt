import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ResponseService } from "./response.service.ts";
import { AuthGuard } from "../auth/auth.guard.ts";
import type { GetResponseDto } from "./response.types.ts";
import { PromptService } from "../prompt/prompt.service.ts";
import type { RequestType } from "../global/global.types.ts";

@Controller("response")
export class ResponseController {
  constructor(
    private prompt: PromptService,
    private response: ResponseService,
  ) {}

  @Get("/hello")
  hello() {
    return "Hello, World!";
  }

  @UseGuards(AuthGuard)
  @Post("/get-response")
  async getResponse(
    @Body() options: GetResponseDto,
    @Req() { uid }: RequestType,
  ) {
    const { prompt_name, prompt_version, input } = options;
    const prompt = await this.prompt.getPrompt({
      prompt_name,
      prompt_version,
    });
    if (!prompt) {
      console.error("Prompt not found", prompt_name, prompt_version);
      throw new BadRequestException("Prompt not found");
    }

    return this.response.getResponse({
      prompt,
      input,
      uid,
    });
  }
}
