import { gray } from "https://deno.land/std@0.163.0/fmt/colors.ts";
import { RequestSpacing, Worker } from "../types.ts";

import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/repository/GeneralRepository.ts";

export default class SpacingManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  sendRequest(worker: Worker, spacing: number) {
    // deno-fmt-ignore
    console.log(`${gray("[Spacing]")} The server has send a new spacing request`);

    const request = new RequestSpacing(spacing);

    this.handleMessage(worker, request);
  }
}
