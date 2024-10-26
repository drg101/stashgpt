import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";

@Injectable()
export class UtilService {
  sha256(...inputs: string[]) {
    const inputStr = inputs.join("$");
    const hash = createHash("sha256");
    hash.update(inputStr);
    return hash.digest("hex");
  }
}
