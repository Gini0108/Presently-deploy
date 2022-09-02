import { RequestInterval, RespondInterval, Worker } from "../types.ts";
import { gray } from "https://deno.land/std@0.154.0/fmt/colors.ts";

import AbstractManager from "./AbstractManager.ts";
import WorkerRepository from "../repository/WorkerRepository.ts";

export default class IntervalManager extends AbstractManager {
  constructor(repository: WorkerRepository) {
    super(repository);
  }

  handleRequest(worker: Worker, interval: number) {
    console.log(`${gray("[Interval]")} Interval update requested`);

    const request = new RequestInterval(interval);

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondInterval) {
    console.log(`${gray("[Interval]")} Interval update received`);
  }
}
