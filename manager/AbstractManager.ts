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

  protected handleMessage(client: Client, update: RequestAbstract) {
    const body = JSON.stringify(update);
    const socket = client.socket;

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(body);
    } else {
      console.log(`${red("[Abstract]")} Abstract update not ready`);
    }
  }
}