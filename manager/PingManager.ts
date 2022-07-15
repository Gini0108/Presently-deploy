import { Client, RequestPing, RespondIdentity } from "../types.ts";
import { blue } from "https://deno.land/std@0.148.0/fmt/colors.ts";

import ClientRepository from "../repository/ClientRepository.ts";
import AbstractManager from "./AbstractManager.ts";

export default class PingManager extends AbstractManager {
  constructor(repository: ClientRepository) {
    super(repository);
  }

  handleRequest(client: Client) {
    const request = new RequestPing();

    this.handleMessage(client, request);
  
    console.log(`${blue("[Ping]")} Ping update requested`);
  }

  async handleRespond(client: Client, response: RespondIdentity) {
    console.log(`${blue("[Ping]")} Ping update received`);
  }
}