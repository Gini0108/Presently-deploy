import { RequestInterval, RespondInterval, Worker } from "../types.ts";
import { gray } from "https://deno.land/std@0.162.0/fmt/colors.ts";

import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/GeneralRepository.ts";

export default class IntervalManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  handleRequest(worker: Worker, interval: number) {
    console.log(
      `${
        gray("[Interval]")
      } An interval update has been requested by the server`,
    );

    const request = new RequestInterval(interval);

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondInterval) {
    console.log(
      `${
        gray("[Interval]")
      } An interval update has been received by the server`,
    );
  }
}
