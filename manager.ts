import {
  Action,
  Client,
} from "./types.ts";

import PingManager from "./manager/PingManager.ts";
import IdentityManager from "./manager/IdentityManager.ts";
import ClientRepository from "./repository/ClientRepository.ts";

class Manager {
  pingManager: PingManager;
  identityManager: IdentityManager;

  clients: Client[] = [];
  repository: ClientRepository;

  constructor() {
    this.repository = new ClientRepository("client");

    this.pingManager = new PingManager(this.repository);
    this.identityManager = new IdentityManager(this.repository);
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
      this.onOpen(client);
    };
  }

  async onMessage(client: Client, event: MessageEvent) {
    const data = event.data;
    const parse = JSON.parse(data);
    const action = parse.action;

    switch (action) {
      case Action.RespondIdentity: {
        await this.identityManager.handleRespond(client, parse);
        break;
      }
      case Action.RespondPing: {
        await this.pingManager.handleRequest(client);
        break;
      }
    }
  }

  async onClose(client: Client) {
    const index = this.clients.indexOf(client);
    const {
      socket,
      entity,
      interval,
    } = client;

    // Remove every websocket callback to prevent errors and overhead 
    socket.onopen = () => {};
    socket.onclose = () => {};
    socket.onmessage = () => {};

    // Since we can't reach the machine anymore we'll stop pinging it
    clearTimeout(interval);

    // Remove the client from the clients array
    this.clients.splice(index, 1);

    // Set the client status to offline in the database
    if (entity) {
      entity.online.setValue(false);
      await this.repository.updateObject(entity);
    }
  }

  async onOpen(client: Client) {
    const {
      socket,
      entity,
    } = client;

    // Request the identity once the WebSocket has been opened
    this.identityManager.handleRequest(client);

    // We'll thing the client every 10 seconds to ensure the connection stays open
    client.interval = setInterval(() => this.pingManager.handleRequest({ socket }), 10000);

    // Set the client status to online in the database
    if (entity) {
      entity.online.setValue(true);
      await this.repository.updateObject(entity);
    }
  }
}

const manager = new Manager();

export default manager;
