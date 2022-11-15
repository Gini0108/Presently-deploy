import { magenta } from "https://deno.land/std@0.164.0/fmt/colors.ts";
import { RequestIdentity, ResponseIdentity, Worker } from "../types.ts";

import WorkerEntity from "../entity/WorkerEntity.ts";
import AbstractManager from "./AbstractManager.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/repository/GeneralRepository.ts";

export default class IdentityManager extends AbstractManager {
  constructor(repository: GeneralRepository) {
    super(repository);
  }

  async receiveRequest(worker: Worker, request: RequestIdentity) {
    // deno-fmt-ignore
    console.log(`${magenta("[Identity]")} The server has received a identity request`);

    const uuid = request.uuid;
    const secret = request.secret;

    let entity = new WorkerEntity();
    let success = false;

    entity.uuid.setValue(uuid);

    try {
      entity = await this.repository.getObject(uuid) as WorkerEntity;
      success = entity.secret.getValue() === secret;
    } catch {
      success = false;
    }

    // TODO: Fix update for UUID's

    if (success) {
      worker.entity = entity;
      // Set the worker to online
      // entity.online.setValue(true);

      // Save the worker state in the database
      // await this.repository.updateObject(entity);
    }

    this.sendResponse(worker, success);
  }

  sendResponse(worker: Worker, success: boolean) {
    // deno-fmt-ignore
    console.log(`${magenta("[Identity]")} The server has responded to a identity request`);

    const response = new ResponseIdentity(success);

    this.handleMessage(worker, response);
  }
}
