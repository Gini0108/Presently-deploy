import { RequestOpen, RespondOpen, Worker } from "../types.ts";
import { yellow } from "https://deno.land/std@0.160.0/fmt/colors.ts";

import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/GeneralRepository.ts";

export default class OpenManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  handleRequest(worker: Worker, file: string) {
    console.log(
      `${yellow("[Open]")} An open update has been requested by the server`,
    );

    const request = new RequestOpen(file);

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondOpen) {
    console.log(
      `${yellow("[Open]")} An open update has been received by the server`,
    );
  }
}
