import { RequestOpen, RespondOpen, Worker } from "../types.ts";
import { yellow } from "https://deno.land/std@0.163.0/fmt/colors.ts";

import spacesClient from "../../Uberdeno/services/spacesClient.ts";
import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/GeneralRepository.ts";

export default class OpenManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  async handleRequest(worker: Worker, uuid: string) {
    console.log(
      `${yellow("[Open]")} An open update has been requested by the server`,
    );

    const spacesResponse = await spacesClient.listFiles(`${uuid}/`);
    const spacesContent = spacesResponse?.contents;
    const spacesSigned = spacesContent?.map((spacesItem) => {
      return {
        key: spacesItem.key,
        size: spacesItem.size,
        updated: spacesItem.lastModified,
        download: spacesClient.signedGET(spacesItem.key!),
      };
    });

    const request = new RequestOpen(uuid, spacesSigned!);

    this.handleMessage(worker, request);
  }

  handleRespond(_worker: Worker, _response: RespondOpen) {
    console.log(
      `${yellow("[Open]")} An open update has been received by the server`,
    );
  }
}
