import ClientRepository from "../repository/ClientRepository.ts";

import { red } from "https://deno.land/std@0.148.0/fmt/colors.ts";
import {
  Client,
  RequestAbstract
} from "../types.ts";

export default class AbstractManager {
  protected repository: ClientRepository;

  protected constructor(repository: ClientRepository) {
    this.repository  = repository;
  }

  protected handleMessage(client: Client, update: RequestAbstract, persistent = true) {
    const body = JSON.stringify(update);
    const socket = client.socket;

    const socketReady = socket.readyState === WebSocket.OPEN;
    const entityReady = client.entity !== undefined || !persistent;

    if (socketReady && entityReady) {
      client.socket.send(body);

      console.log(`${red("[Abstract]")} Abstract update sent`);
    } else {
      console.log(`${red("[Abstract]")} Abstract update not ready`);
    }
  }
}