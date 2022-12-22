import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/repository/GeneralRepository.ts";

import { red } from "https://deno.land/std@0.170.0/fmt/colors.ts";
import { RequestAbstract, Worker } from "../types.ts";

export default class AbstractManager {
  protected repository: GeneralRepository;

  protected constructor(repository: GeneralRepository) {
    this.repository = repository;
  }

  protected handleMessage(worker: Worker, update: RequestAbstract) {
    const body = JSON.stringify(update);
    const socket = worker.socket;

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(body);
    } else {
      console.log(`${red("[Abstract]")} Couldn't send the message to worker`);
    }
  }
}
