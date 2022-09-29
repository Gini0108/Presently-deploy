import WorkerRepository from "../repository/WorkerRepository.ts";

import { red } from "https://deno.land/std@0.158.0/fmt/colors.ts";
import { RequestAbstract, Worker } from "../types.ts";

export default class AbstractManager {
  protected repository: WorkerRepository;

  protected constructor(repository: WorkerRepository) {
    this.repository = repository;
  }

  protected handleMessage(worker: Worker, update: RequestAbstract) {
    const body = JSON.stringify(update);
    const socket = worker.socket;

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(body);
    } else {
      console.log(`${red("[Abstract]")} Abstract update not ready`);
    }
  }
}
