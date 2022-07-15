import { Client, RequestPing, RespondIdentity } from "../types.ts";
import { blue } from "https://deno.land/std@0.148.0/fmt/colors.ts";

import ClientRepository from "../repository/ClientRepository.ts";
import AbstractManager from "./AbstractManager.ts";

export default class PingManager extends AbstractManager {
  constructor(repository: ClientRepository) {
    super(repository);
  }

  handleRequest(client: Client) {
    console.log(`${blue("[Ping]")} Ping update requested`);

    const request = new RequestPing();

    this.handleMessage(client, request);
  }

  handleRespond(_client: Client, _response: RespondIdentity) {
    console.log(`${blue("[Ping]")} Ping update received`);
  }
}
