import { green } from "https://deno.land/std@0.166.0/fmt/colors.ts";
import { RequestState, Worker } from "../types.ts";

import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.4/repository/GeneralRepository.ts";

export default class StateManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  sendRequest(worker: Worker, playing: boolean) {
    // deno-fmt-ignore
    console.log(`${green("[State]")} The server has send a new state request`);

    const request = new RequestState(playing);

    this.handleMessage(worker, request);
  }
}
