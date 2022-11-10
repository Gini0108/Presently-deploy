import { RequestInterval, RespondInterval, Worker } from "../types.ts";
import { gray } from "https://deno.land/std@0.163.0/fmt/colors.ts";

import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/repository/GeneralRepository.ts";

export default class IntervalManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  handleRequest(worker: Worker, spacing: number) {
    console.log(
      `${
        gray("[Interval]")
      } An spacing update has been requested by the server`,
    );

    const request = new RequestInterval(spacing);

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondInterval) {
    console.log(
      `${gray("[Interval]")} An spacing update has been received by the server`,
    );
  }
}
