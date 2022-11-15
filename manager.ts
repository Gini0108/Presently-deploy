import { Action, Worker } from "./types.ts";

import WorkerEntity from "./entity/WorkerEntity.ts";
import WorkerCollection from "./collection/WorkerCollection.ts";

import OpenManager from "./manager/OpenManager.ts";
import PingManager from "./manager/PingManager.ts";
import CoverManager from "./manager/CoverManager.ts";
import StateManager from "./manager/StateManager.ts";
import SpacingManager from "./manager/SpacingManager.ts";
import IdentityManager from "./manager/IdentityManager.ts";

import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/repository/GeneralRepository.ts";

class Manager {
  openManager: OpenManager;
  pingManager: PingManager;
  stateManager: StateManager;
  coverManager: CoverManager;
  spacingManager: SpacingManager;
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
    this.coverManager = new CoverManager(this.repository);
    this.spacingManager = new SpacingManager(this.repository);
    this.identityManager = new IdentityManager(this.repository);
  }

  networkOpen(uuid: string) {
    this.workers.forEach((worker) => {
      this.openManager.sendRequest(worker, uuid);
    });
  }

  networkState(playing: boolean) {
    this.workers.forEach((worker) => {
      this.stateManager.sendRequest(worker, playing);
    });
  }

  networkSpacing(spacing: number) {
    this.workers.forEach((worker) => {
      this.spacingManager.sendRequest(worker, spacing);
    });
  }

  addUnknown(socket: WebSocket) {
    const worker = { socket };

    socket.onmessage = (event) => {
      this.onMessage(worker, event);
    };

    socket.onclose = () => {
      socket.onmessage = () => {};
    };
  }

  removeUnknown(worker: Worker) {
    const { socket } = worker;

    socket.close();
    socket.onclose = () => {};
    socket.onmessage = () => {};
  }

  addKnown(worker: Worker) {
    const { workers } = this;
    const { socket } = worker;

    // From now on the worker will be able to receive requests
    workers.push(worker);

    // Ping the worker every 10 seconds too keep it alive
    worker.spacing = setInterval(() => {
      this.pingManager.sendRequest({ socket });
    }, 10000);

    worker.socket.onclose = () => this.removeKnown(worker);
  }

  removeKnown(worker: Worker) {
    const index = this.workers.indexOf(worker);
    const {
      socket,
      entity,
      spacing,
    } = worker;

    // Remove every websocket callback to prevent errors and overhead
    socket.onclose = () => {};
    socket.onmessage = () => {};

    // Since we can't reach the machine anymore we'll stop pinging it
    clearTimeout(spacing);

    // Remove the worker from the workers array
    this.workers.splice(index, 1);

    // Set the worker status to offline in the database
    if (entity) {
      // entity.online.setValue(false);
      // await this.repository.updateObject(entity);
    }
  }

  async onMessage(worker: Worker, event: MessageEvent) {
    const data = event.data;
    const parse = JSON.parse(data);
    const action = parse.action;

    // Only allow the worker to identify itself
    if (!worker.entity && action !== Action.RequestIdentity) {
      return;
    }

    switch (action) {
      case Action.ResponsePing: {
        await this.pingManager.receiveResponse(worker, parse);
        break;
      }
      case Action.RequestCover: {
        await this.coverManager.receiveRequest(worker, parse);
        break;
      }
      case Action.RequestIdentity: {
        await this.identityManager.receiveRequest(worker, parse);

        if (worker.entity) {
          this.addKnown(worker);
        } else {
          this.removeUnknown(worker);
        }

        break;
      }
    }
  }
}

const manager = new Manager();

export default manager;
