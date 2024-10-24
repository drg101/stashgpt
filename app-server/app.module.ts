import { Module } from "@nestjs/common";
import { ResponseController } from "./src/response/response.controller.ts";
import { ResponseService } from "./src/response/response.service.ts";

@Module({ providers: [ResponseService], controllers: [ResponseController] })
export class AppModule {}
