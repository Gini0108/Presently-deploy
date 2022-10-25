import { RequestState, RespondState, Worker } from "../types.ts";
import { green } from "https://deno.land/std@0.159.0/fmt/colors.ts";

import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/GeneralRepository.ts";

export default class StateManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  handleRequest(worker: Worker, playing: boolean) {
    console.log(`${green("[State]")} A state update has been requested by the server`);

    const request = new RequestState(playing);

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondState) {
    console.log(`${green("[State]")} A state update has been received by the server`);
  }
}
