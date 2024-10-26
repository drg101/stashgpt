import { Injectable } from "@nestjs/common";
import type { ModelEvaluateOptions, ModelInterface } from "./model.types.ts";
import type { Prompt } from "../prompt/prompt.schema.ts";
import { GoogleAIService } from "./providers/google-ai.service.ts";

@Injectable()
export class ModelService implements ModelInterface {
  private readonly serviceMap: Record<
    Prompt["model"]["provider"],
    ModelInterface
  >;

  constructor(private google: GoogleAIService) {
    this.serviceMap = {
      "google-ai": this.google,
    };
  }

  async evaluate(options: ModelEvaluateOptions) {
    return await this.serviceMap[options.prompt.model.provider].evaluate(
      options,
    );
  }
}
