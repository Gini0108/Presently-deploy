import { RequestIdentity, RespondIdentity, Worker } from "../types.ts";
import { magenta } from "https://deno.land/std@0.162.0/fmt/colors.ts";

import WorkerEntity from "../entity/WorkerEntity.ts";
import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/GeneralRepository.ts";

export default class IdentityManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  handleRequest(worker: Worker) {
    console.log(
      `${
        magenta("[Identity]")
      } An identity update has been requested by the server`,
    );

    const request = new RequestIdentity();

    this.handleMessage(worker, request);
  }

  async handleRespond(worker: Worker, response: RespondIdentity) {
    console.log(
      `${
        magenta("[Identity]")
      } An identity update has been received by the server`,
    );

    const uuid = response.uuid;
    const entity = new WorkerEntity();

    entity.uuid.setValue(uuid);
    entity.online.setValue(true);

    try {
      worker.entity = await this.repository.addObject(entity) as WorkerEntity;
    } catch {
      worker.entity = await this.repository.getObject(uuid) as WorkerEntity;
    }
  }
}
