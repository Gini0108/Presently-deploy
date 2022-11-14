import { yellow } from "https://deno.land/std@0.163.0/fmt/colors.ts";
import { RequestOpen, Worker } from "../types.ts";

import spacesClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/services/spacesClient.ts";
import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/repository/GeneralRepository.ts";

export default class OpenManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  async sendRequest(worker: Worker, uuid: string) {
    // deno-fmt-ignore
    console.log(`${yellow("[Open]")} The server has send a new open request`);

    const spacesResponse = await spacesClient.listFiles(`${uuid}/`);
    const spacesContent = spacesResponse?.contents;
    const spacesSigned = spacesContent?.map((spacesItem) => {
      return {
        key: spacesItem.key!,
        size: spacesItem.size!,
        updated: spacesItem.lastModified!,
        download: spacesClient.signedGET(spacesItem.key!),
      };
    });

    const request = new RequestOpen(uuid, spacesSigned!);

    this.handleMessage(worker, request);
  }
}
