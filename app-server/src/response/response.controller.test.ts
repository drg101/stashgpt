import { Test } from "@nestjs/testing";
import { ResponseController } from "./response.controller.ts";
import { ResponseService } from "./response.service.ts";
import { expect } from "@std/expect";

const moduleRef = await Test.createTestingModule({
  controllers: [ResponseController],
  providers: [ResponseService],
}).compile();

const responseService = moduleRef.get(ResponseService);
const responseController = moduleRef.get(ResponseController);

Deno.test("Exists", () => {
  expect(responseService).toBeDefined();
  expect(responseController).toBeDefined();
});
