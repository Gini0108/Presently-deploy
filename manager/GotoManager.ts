import { RequestGoto, RespondGoto, Worker } from "../types.ts";
import { cyan } from "https://deno.land/std@0.148.0/fmt/colors.ts";

import AbstractManager from "./AbstractManager.ts";
import WorkerRepository from "../repository/WorkerRepository.ts";

export default class GotoManager extends AbstractManager {
  constructor(repository: WorkerRepository) {
    super(repository);
  }

  handleRequest(worker: Worker, index: number) {
    console.log(`${cyan("[Goto]")} Goto update requested`);

    const request = new RequestGoto(index);

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondGoto) {
    console.log(`${cyan("[Goto]")} Goto update received`);
  }
}
