import { Action, Worker } from "./types.ts";

import WorkerEntity from "./entity/WorkerEntity.ts";
import WorkerCollection from "./collection/WorkerCollection.ts";

import OpenManager from "./manager/OpenManager.ts";
import PingManager from "./manager/PingManager.ts";
import StateManager from "./manager/StateManager.ts";
import IntervalManager from "./manager/IntervalManager.ts";
import IdentityManager from "./manager/IdentityManager.ts";

import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/GeneralRepository.ts";

class Manager {
  openManager: OpenManager;
  pingManager: PingManager;
  stateManager: StateManager;
  intervalManager: IntervalManager;
  identityManager: IdentityManager;

  workers: Worker[] = [];
  repository: GeneralRepository;

  constructor() {
    this.repository = new GeneralRepository(
      "worker",
      WorkerEntity,
      WorkerCollection,
    );

    this.openManager = new OpenManager(this.repository);
    this.pingManager = new PingManager(this.repository);
    this.stateManager = new StateManager(this.repository);
    this.intervalManager = new IntervalManager(this.repository);
    this.identityManager = new IdentityManager(this.repository);
  }

  systemOpen(file: string) {
    this.workers.forEach((worker) => {
      this.openManager.handleRequest(worker, file);
    });
  }

  systemState(playing: boolean) {
    this.workers.forEach((worker) => {
      this.stateManager.handleRequest(worker, playing);
    });
  }

  systemInterval(interval: number) {
    this.workers.forEach((worker) => {
      this.intervalManager.handleRequest(worker, interval);
    });
  }

  addWorker(socket: WebSocket) {
    const worker = { socket };

    this.workers.push(worker);

    socket.onmessage = (event) => {
      this.onMessage(worker, event);
    };

    socket.onclose = () => {
      this.onClose(worker);
    };

    socket.onopen = () => {
      this.onOpen(worker);
    };
  }

  async onMessage(worker: Worker, event: MessageEvent) {
    const data = event.data;
    const parse = JSON.parse(data);
    const action = parse.action;

    switch (action) {
      case Action.RespondIdentity: {
        await this.identityManager.handleRespond(worker, parse);
        break;
      }
      case Action.RespondPing: {
        await this.pingManager.handleRespond(worker, parse);
        break;
      }
      case Action.RespondOpen: {
        await this.openManager.handleRespond(worker, parse);
        break;
      }
      case Action.RespondState: {
        await this.stateManager.handleRespond(worker, parse);
        break;
      }
    }
  }

  async onClose(worker: Worker) {
    const index = this.workers.indexOf(worker);
    const {
      socket,
      entity,
      interval,
    } = worker;

    // Remove every websocket callback to prevent errors and overhead
    socket.onopen = () => {};
    socket.onclose = () => {};
    socket.onmessage = () => {};

    // Since we can't reach the machine anymore we'll stop pinging it
    clearTimeout(interval);

    // Remove the worker from the workers array
    this.workers.splice(index, 1);

    // Set the worker status to offline in the database
    if (entity) {
      entity.online.setValue(false);
      await this.repository.updateObject(entity);
    }
  }

  onOpen(worker: Worker) {
    const { socket } = worker;

    // Request the identity once the WebSocket has been opened
    this.identityManager.handleRequest(worker);

    // We'll thing the worker every 10 seconds to ensure the connection stays open
    worker.interval = setInterval(() => {
      this.pingManager.handleRequest({ socket });
    }, 10000);
  }
}

const manager = new Manager();

export default manager;
