import { Module } from "@nestjs/common";
import { ResponseController } from "./src/response/response.controller.ts";
import { ResponseService } from "./src/response/response.service.ts";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { PromptService } from "./src/prompt/prompt.service.ts";
import { UtilService } from "./src/util/util.service.ts";
import { ModelService } from "./src/model/model.service.ts";
import { GoogleAIService } from "./src/model/providers/google-ai.service.ts";

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    ResponseService,
    PromptService,
    UtilService,
    ModelService,
    GoogleAIService,
  ],
  controllers: [ResponseController],
})
export class AppModule {}
