import { Client, Action, RequestAbstract, RequestPing, RespondAbstract,RespondPing, RequestIdentity, RespondIdentity } from "./types.ts";

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
    }

    socket.onopen = () => {
      const request = new RequestIdentity();
      this.sendRequest(client, request);
    
      setInterval(() => {
        const request = new RequestPing();
        this.sendRequest(client, request);
      }, 1000);
    }
  }

  async onMessage(client: Client, event: MessageEvent) {
    const data = event.data;
    const body = JSON.parse(data) as RespondAbstract;
    const action = body.action;

    switch (action) {
      case Action.RespondIdentity: {
        const respond = body as RespondIdentity;
        const serial = respond.serial;

        console.log(`Serial: ${respond.serial}`);

        try {
          const entity = new ClientEntity();

          entity.serial.setValue(respond.serial);
          
          client.entity = await this.repository.addObject(entity);
        } catch {
          client.entity = await this.repository.getObjectBySerial(serial)
        }

        break;
      }
      case Action.RespondPing: {
        const response = body as RespondPing;
        const current = Date.now();
        const heard = new Date(response.heard);
        if (client.entity) {
        client.entity?.heard.setValue(heard);
        this.repository.updateObject(client.entity!);

        console.log(`Ping: ${current - response.heard}ms`);
        }
        break;
      }
    }
  }

  onClose(client: Client) {
    const index = this.clients.indexOf(client);

    this.clients.splice(index, 1);
  }

  sendRequest(client: Client, update: RequestAbstract) {
    const body = JSON.stringify(update);

    client.socket.send(body);
  }
}

const manager = new Manager();

export default manager;
