import { blue } from "https://deno.land/std@0.168.0/fmt/colors.ts";
import { RequestPing, ResponseIdentity, Worker } from "../types.ts";

import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.0/repository/GeneralRepository.ts";

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

  receiveResponse(_worker: Worker, _response: ResponseIdentity) {
    // deno-fmt-ignore
    console.log(`${blue("[Ping]")} The server has received a ping response`);

    // TODO: Store the ping time in the repository
  }
}
