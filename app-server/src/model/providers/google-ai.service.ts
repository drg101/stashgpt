import { Injectable } from "@nestjs/common";
import type { ModelEvaluateOptions, ModelInterface } from "../model.types.ts";
import Handlebars from "handlebars";
import { GoogleGenerativeAI, ResponseSchema } from "@google/generative-ai";

@Injectable()
export class GoogleAIService implements ModelInterface {
  private readonly genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async evaluate(options: ModelEvaluateOptions) {
    const { prompt, input } = options;
    if (prompt.provider !== "google-ai") {
      throw new Error(
        `Invalid provider for google-ai: ${prompt.provider}`,
      );
    }

    const model = this.genAI.getGenerativeModel({
      model: prompt.model,
      systemInstruction: prompt.system_prompt,
    });

    const template = Handlebars.compile(prompt.user_prompt);
    const userPrompt = template(input);

    const chatSession = model.startChat({
      generationConfig: {
        responseSchema: prompt.schema as ResponseSchema,
        temperature: prompt.temperature,
      },
    });

    console.log("Using user prompt", userPrompt);

    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    return JSON.parse(result.response.text());
  }
}
