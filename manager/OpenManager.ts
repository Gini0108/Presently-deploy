import { RequestOpen, RespondOpen, Worker } from "../types.ts";
import { yellow } from "https://deno.land/std@0.148.0/fmt/colors.ts";

import AbstractManager from "./AbstractManager.ts";
import WorkerRepository from "../repository/WorkerRepository.ts";

export default class OpenManager extends AbstractManager {
  constructor(repository: WorkerRepository) {
    super(repository);
  }

  handleRequest(worker: Worker, filename: string, location: string) {
    console.log(`${yellow("[Open]")} Open update requested`);

    const request = new RequestOpen(filename, location);

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondOpen) {
    console.log(`${yellow("[Open]")} Open update received`);
  }
}
