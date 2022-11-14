import { blue } from "https://deno.land/std@0.163.0/fmt/colors.ts";
import { RequestPing, RespondIdentity, Worker } from "../types.ts";

import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/repository/GeneralRepository.ts";

export default class PingManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  sendRequest(worker: Worker) {
    // deno-fmt-ignore
    console.log(`${blue("[Ping]")} The server has send a new ping request`);

    const request = new RequestPing();

    this.handleMessage(worker, request);
  }

  receiveResponse(_worker: Worker, _response: RespondIdentity) {
    // deno-fmt-ignore
    console.log(`${blue("[Ping]")} The server has received a ping response`);

    // TODO: Store the ping time in the repository
  }
}
