import { Client, RequestIdentity, RespondIdentity } from "../types.ts";
import { magenta } from "https://deno.land/std@0.148.0/fmt/colors.ts";

import ClientEntity from "../entity/ClientEntity.ts";
import ClientRepository from "../repository/ClientRepository.ts";
import AbstractManager from "./AbstractManager.ts";

export default class IdentityManager extends AbstractManager {
  constructor(repository: ClientRepository) {
    super(repository);
  }

  handleRequest(client: Client) {
    const request = new RequestIdentity();

    this.handleMessage(client, request, false);
  
    console.log(`${magenta("[Identity]")} Identity update requested`);
  }

  async handleRespond(client: Client, response: RespondIdentity) {
    const serial = response.serial;
    const entity = new ClientEntity();
  
    entity.serial.setValue(serial);
  
    try {
      client.entity = await this.repository.addObject(entity);
    } catch {
      client.entity = await this.repository.getObjectBySerial(serial);
    }
  
    console.log(`${magenta("[Identity]")} Identity update received`);
  }
}