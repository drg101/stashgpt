import { Controller, Get } from "@nestjs/common";
import { ResponseService } from "./response.service.ts";

@Controller("response")
export class ResponseController {
  constructor(private helloService: ResponseService) {}

  @Get("/")
  hello() {
    return "test";
  }
}
