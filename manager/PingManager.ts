import { RequestPing, RespondIdentity, Worker } from "../types.ts";
import { blue } from "https://deno.land/std@0.164.0/fmt/colors.ts";

import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/repository/GeneralRepository.ts";

export default class PingManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  handleRequest(worker: Worker) {
    // deno-fmt-ignore
    console.log(`${blue("[Ping]")} An ping update has been requested by the server`);

    const request = new RequestPing();

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondIdentity) {
    // deno-fmt-ignore
    console.log(`${blue("[Ping]")} An ping update has been received by the server`);
  }
}
