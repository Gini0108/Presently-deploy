import {
  Action,
  Client,
  RequestAbstract,
  RequestIdentity,
  RequestPing,
  RespondAbstract,
  RespondIdentity,
  RespondPing,
} from "./types.ts";

import ClientEntity from "./entity/ClientEntity.ts";
import ClientRepository from "./repository/ClientRepository.ts";

class Manager {
  clients: Client[] = [];
  repository: ClientRepository;

  constructor() {
    this.repository = new ClientRepository("client");
  }

  addClient(socket: WebSocket) {
    const client = { socket };

    this.clients.push(client);

    socket.onmessage = (event) => {
      this.onMessage(client, event);
    };

    socket.onclose = () => {
      this.onClose(client);
    };

    socket.onopen = () => {
      this.requestIdentity(client);
    };
  }

  async onMessage(client: Client, event: MessageEvent) {
    const data = event.data;
    const body = JSON.parse(data) as RespondAbstract;
    const action = body.action;

    if (action === Action.RespondIdentity) {
      await this.handleIdentity(client, body as RespondIdentity);

      client.interval = setInterval(() => {
        this.requestPing(client);
      }, 1000);

      return;
    }

    switch (action) {
      case Action.RespondPing: {
        this.handlePing(client, body as RespondPing);
        break;
      }
    }
  }

  onClose(client: Client) {
    const index = this.clients.indexOf(client);

    const {
      socket,
      entity,
      interval,
    } = client;

    socket.onmessage = () => {};
    socket.onclose = () => {};
    socket.onopen = () => {};

    clearTimeout(interval);

    if (entity) {
      entity.online.setValue(false);

      this.repository.updateObject(entity);
    }

    this.clients.splice(index, 1);
  }

  sendRequest(client: Client, update: RequestAbstract) {
    const body = JSON.stringify(update);

    client.socket.send(body);
  }

  private requestIdentity(client: Client) {
    const request = new RequestIdentity();

    this.sendRequest(client, request);
  }

  private async handleIdentity(client: Client, response: RespondIdentity) {
    const serial = response.serial;
    const entity = new ClientEntity();

    entity.serial.setValue(serial);

    try {
      client.entity = await this.repository.addObject(entity);
    } catch {
      client.entity = await this.repository.getObjectBySerial(serial);
    }
  }

  private async requestPing(client: Client) {
    const request = new RequestPing();

    this.sendRequest(client, request);

    const called = new Date();
    const entity = client.entity!;

    entity.called.setValue(called);

    client.entity = await this.repository.updateObject(entity);
  }

  private async handlePing(client: Client, response: RespondPing) {
    const heard = new Date(response.heard);
    const entity = client.entity!;

    const called = entity.called.getValue();
    const online = typeof called === "undefined" ||
      heard.getTime() - called.getTime() < 1000;

    entity.heard.setValue(heard);
    entity.online.setValue(online);

    client.entity = await this.repository.updateObject(entity);

    console.log("Recieved ping update");
  }
}

const manager = new Manager();

export default manager;
