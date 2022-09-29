import { RequestPing, RespondIdentity, Worker } from "../types.ts";
import { blue } from "https://deno.land/std@0.158.0/fmt/colors.ts";

import WorkerRepository from "../repository/WorkerRepository.ts";
import AbstractManager from "./AbstractManager.ts";

export default class PingManager extends AbstractManager {
  constructor(repository: WorkerRepository) {
    super(repository);
  }

  handleRequest(worker: Worker) {
    console.log(`${blue("[Ping]")} Ping update requested`);

    const request = new RequestPing();

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondIdentity) {
    console.log(`${blue("[Ping]")} Ping update received`);
  }
}
