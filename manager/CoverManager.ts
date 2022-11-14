import { magenta } from "https://deno.land/std@0.163.0/fmt/colors.ts";
import { RequestCover, RespondCover, Worker } from "../types.ts";

import spacesClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/services/spacesClient.ts";
import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/repository/GeneralRepository.ts";

export default class CoverManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  receiveRequest(worker: Worker, _request: RequestCover) {
    // deno-fmt-ignore
    console.log(`${magenta("[Cover]")} The server has received a cover request`);

    const entity = worker.entity!;
    const network = entity.network.getValue()!;

    this.sendResponse(worker, network);
  }

  sendResponse(worker: Worker, network: string) {
    // deno-fmt-ignore
    console.log(`${magenta("[Cover]")} The server has responded to a cover request`);

    const download = spacesClient.signedGET(`cover/${network}.png`);
    const respond = new RespondCover(download);

    this.handleMessage(worker, respond);
  }
}
