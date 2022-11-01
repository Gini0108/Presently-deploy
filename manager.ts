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
  spacingManager: IntervalManager;
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
    this.spacingManager = new IntervalManager(this.repository);
    this.identityManager = new IdentityManager(this.repository);
  }

  networkOpen(uuid: string) {
    this.workers.forEach((worker) => {
      this.openManager.handleRequest(worker, uuid);
    });
  }

  networkState(playing: boolean) {
    this.workers.forEach((worker) => {
      this.stateManager.handleRequest(worker, playing);
    });
  }

  networkInterval(spacing: number) {
    this.workers.forEach((worker) => {
      this.spacingManager.handleRequest(worker, spacing);
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
      spacing,
    } = worker;

    // Remove every websocket callback to prevent errors and overhead
    socket.onopen = () => {};
    socket.onclose = () => {};
    socket.onmessage = () => {};

    // Since we can't reach the machine anymore we'll stop pinging it
    clearTimeout(spacing);

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
    worker.spacing = setInterval(() => {
      this.pingManager.handleRequest({ socket });
    }, 10000);
  }
}

const manager = new Manager();

export default manager;
