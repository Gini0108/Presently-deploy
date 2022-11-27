import { Action, Worker } from "./types.ts";

import WorkerEntity from "./entity/WorkerEntity.ts";
import WorkerCollection from "./collection/WorkerCollection.ts";

import NetworkEntity from "./entity/NetworkEntity.ts";
import NetworkCollection from "./collection/NetworkCollection.ts";

import OpenManager from "./manager/OpenManager.ts";
import PingManager from "./manager/PingManager.ts";
import CoverManager from "./manager/CoverManager.ts";
import StateManager from "./manager/StateManager.ts";
import SpacingManager from "./manager/SpacingManager.ts";
import IdentityManager from "./manager/IdentityManager.ts";

import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.1.0/repository/GeneralRepository.ts";

class Manager {
  openManager: OpenManager;
  pingManager: PingManager;
  stateManager: StateManager;
  coverManager: CoverManager;
  spacingManager: SpacingManager;
  identityManager: IdentityManager;

  workers: Worker[] = [];
  workerRepository: GeneralRepository;
  networkRepository: GeneralRepository;

  constructor() {
    this.workerRepository = new GeneralRepository(
      "worker",
      WorkerEntity,
      WorkerCollection,
    );

    this.networkRepository = new GeneralRepository(
      "network",
      NetworkEntity,
      NetworkCollection,
    );

    this.openManager = new OpenManager(this.workerRepository);
    this.pingManager = new PingManager(this.workerRepository);
    this.stateManager = new StateManager(this.workerRepository);
    this.coverManager = new CoverManager(this.workerRepository);
    this.spacingManager = new SpacingManager(this.workerRepository);
    this.identityManager = new IdentityManager(this.workerRepository);
  }

  networkOpen(network: string, uuid: string) {
    this.workers.forEach((worker) => {
      if (worker.network === network) {
        this.openManager.sendRequest(worker, uuid);
      }
    });
  }

  networkState(network: string, playing: boolean) {
    this.workers.forEach((worker) => {
      if (worker.network === network) {
        this.stateManager.sendRequest(worker, playing);
      }
    });
  }

  networkSpacing(network: string, spacing: number) {
    this.workers.forEach((worker) => {
      if (worker.network === network) {
        this.spacingManager.sendRequest(worker, spacing);
      }
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
    const { socket } = worker;

    // From now on the worker will be able to receive requests
    this.workers.push(worker);

    // Ping the worker every 10 seconds too keep it alive
    worker.interval = setInterval(() => {
      this.pingManager.sendRequest({ socket });
    }, 10000);

    worker.socket.onclose = () => this.removeKnown(worker);
  }

  async startKnown(worker: Worker) {
    const networkUuid = worker.entity!.network.getValue()!;
    const networkEntity = await this.networkRepository.getObject(
      networkUuid,
    ) as NetworkEntity;

    const networkFile = networkEntity.file.getValue();
    const networkState = networkEntity.playing.getValue()!;
    const networkSpacing = networkEntity.spacing.getValue()!;

    if (networkFile) this.openManager.sendRequest(worker, networkFile);
    if (networkState) this.stateManager.sendRequest(worker, networkState);
    if (networkSpacing !== 10000) {
      this.spacingManager.sendRequest(worker, networkSpacing);
    }
  }

  async removeKnown(worker: Worker) {
    const index = this.workers.indexOf(worker);
    const {
      socket,
      entity,
      interval,
    } = worker;

    // Remove every websocket callback to prevent errors and overhead
    socket.onclose = () => {};
    socket.onmessage = () => {};

    // Since we can't reach the machine anymore we'll stop pinging it
    clearInterval(interval);

    // Remove the worker from the workers array
    this.workers.splice(index, 1);

    // Set the worker status to offline in the database
    if (entity) {
      entity.online.setValue(false);
      await this.workerRepository.updateObject(entity);
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
          await this.addKnown(worker);
          await this.startKnown(worker);
        } else {
          await this.removeUnknown(worker);
        }

        break;
      }
    }
  }
}

const manager = new Manager();

export default manager;
