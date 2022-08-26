import { RequestState, RespondState, Worker } from "../types.ts";
import { green } from "https://deno.land/std@0.153.0/fmt/colors.ts";

import AbstractManager from "./AbstractManager.ts";
import WorkerRepository from "../repository/WorkerRepository.ts";

export default class StateManager extends AbstractManager {
  constructor(repository: WorkerRepository) {
    super(repository);
  }

  handleRequest(worker: Worker, playing: boolean) {
    console.log(`${green("[State]")} State update requested`);

    const request = new RequestState(playing);

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondState) {
    console.log(`${green("[State]")} State update received`);
  }
}
