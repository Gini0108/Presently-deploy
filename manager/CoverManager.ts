import { brightMagenta } from "https://deno.land/std@0.167.0/fmt/colors.ts";
import { RequestCover, ResponseCover, Worker } from "../types.ts";

import spacesClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.0/services/spacesClient.ts";
import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.0/repository/GeneralRepository.ts";

export default class CoverManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  receiveRequest(worker: Worker, _request: RequestCover) {
    // deno-fmt-ignore
    console.log(`${brightMagenta("[Cover]")} The server has received a cover request`);

    const entity = worker.entity!;
    const network = entity.network.getValue()!;

    this.sendResponse(worker, network);
  }

  async sendResponse(worker: Worker, network: string) {
    // deno-fmt-ignore
    console.log(`${brightMagenta("[Cover]")} The server has responseed to a cover request`);

    const spacesResponse = await spacesClient.listFiles(`cover/${network}.png`);
    const spacesContent = spacesResponse?.contents;

    let coverObject;

    if (spacesContent) {
      const coverItem = spacesContent[0];

      // TODO: This logic can be moved to Uberdeno
      coverObject = {
        name: coverItem.key!.replace(/^.*\/(.*)$/, "$1"),
        size: coverItem.size!,
        updated: coverItem.lastModified!,
        download: spacesClient.signedGET(coverItem.key!),
      };
    }

    const response = new ResponseCover(coverObject);

    this.handleMessage(worker, response);
  }
}
