import { RequestOpen, Worker, RespondOpen } from "../types.ts";
import { yellow } from "https://deno.land/std@0.148.0/fmt/colors.ts";

import AbstractManager from "./AbstractManager.ts";
import WorkerRepository from "../repository/WorkerRepository.ts";

export default class OpenManager extends AbstractManager {
  constructor(repository: WorkerRepository) {
    super(repository);
  }

  handleRequest(worker: Worker) {
    console.log(`${yellow("[Open]")} Open update requested`);

    const bruh1 = "test.pptx";
    const bruh2 = "https://venmurasu.ams3.digitaloceanspaces.com/Presentation1.pptx";

    const request = new RequestOpen(bruh1, bruh2);

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondOpen) {
    console.log(`${yellow("[Open]")} Open update received`);
  }
}
