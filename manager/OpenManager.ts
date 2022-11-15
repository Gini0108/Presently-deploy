import { yellow } from "https://deno.land/std@0.164.0/fmt/colors.ts";
import { RequestOpen, Worker } from "../types.ts";

import spacesClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.1/services/spacesClient.ts";
import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.1/repository/GeneralRepository.ts";

export default class OpenManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  async sendRequest(worker: Worker, uuid: string) {
    // deno-fmt-ignore
    console.log(`${yellow("[Open]")} The server has send a new open request`);

    const spacesResponse = await spacesClient.listFiles(`slides/${uuid}`);
    const spacesContent = spacesResponse?.contents;

    // The first item is just the directory instead of a file so we'll remove it
    spacesContent?.shift();

    const spacesSigned = spacesContent?.map((spacesItem) => {
      return {
        key: spacesItem.key!.replace(/^.+?[/]/, ""),
        size: spacesItem.size!,
        updated: spacesItem.lastModified!,
        download: spacesClient.signedGET(spacesItem.key!),
      };
    });

    const request = new RequestOpen(uuid, spacesSigned!);

    this.handleMessage(worker, request);
  }
}
