import { RequestIdentity, RespondIdentity, Worker } from "../types.ts";
import { magenta } from "https://deno.land/std@0.160.0/fmt/colors.ts";

import WorkerEntity from "../entity/WorkerEntity.ts";
import WorkerRepository from "../repository/WorkerRepository.ts";
import AbstractManager from "./AbstractManager.ts";

export default class IdentityManager extends AbstractManager {
  constructor(repository: WorkerRepository) {
    super(repository);
  }

  handleRequest(worker: Worker) {
    console.log(`${magenta("[Identity]")} Identity update requested`);

    const request = new RequestIdentity();

    this.handleMessage(worker, request);
  }

  async handleRespond(worker: Worker, response: RespondIdentity) {
    console.log(`${magenta("[Identity]")} Identity update received`);

    const serial = response.serial;
    const entity = new WorkerEntity();

    entity.serial.setValue(serial);

    try {
      worker.entity = await this.repository.addObject(entity);
    } catch {
      worker.entity = await this.repository.getObjectBySerial(serial);
    }
  }
}
