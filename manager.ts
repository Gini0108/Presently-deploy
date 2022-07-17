import { Action, Worker } from "./types.ts";

import OpenManager from "./manager/OpenManager.ts";
import PingManager from "./manager/PingManager.ts";
import GotoManager from "./manager/GotoManager.ts";
import IdentityManager from "./manager/IdentityManager.ts";
import WorkerRepository from "./repository/WorkerRepository.ts";

class Manager {
  openManager: OpenManager;
  pingManager: PingManager;
  gotoManager: GotoManager;
  identityManager: IdentityManager;

  workers: Worker[] = [];
  repository: WorkerRepository;

  constructor() {
    this.repository = new WorkerRepository("worker");

    this.openManager = new OpenManager(this.repository);
    this.pingManager = new PingManager(this.repository);
    this.gotoManager = new GotoManager(this.repository);
    this.identityManager = new IdentityManager(this.repository);
  }

  systemOpen(file: string) {
    this.workers.forEach((worker) => {
      this.openManager.handleRequest(worker, file);
    });
  }

  systemGoto(index: number) {
    this.workers.forEach((worker) => {
      this.gotoManager.handleRequest(worker, index);
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
      case Action.RespondGoto: {
        await this.gotoManager.handleRespond(worker, parse);
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

  async onOpen(worker: Worker) {
    const {
      socket,
      entity,
    } = worker;

    // Request the identity once the WebSocket has been opened
    this.identityManager.handleRequest(worker);

    // We'll thing the worker every 10 seconds to ensure the connection stays open
    worker.interval = setInterval(() => {
      this.pingManager.handleRequest({ socket });
    }, 10000);

    // Set the worker status to online in the database
    if (entity) {
      entity.online.setValue(true);
      await this.repository.updateObject(entity);
    }
  }
}

const manager = new Manager();

export default manager;
