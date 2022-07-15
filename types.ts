import ClientEntity from "./entity/ClientEntity.ts";

export interface Client {
  socket: WebSocket;
  entity?: ClientEntity;
  serial?: string;
  interval?: number;
}

export enum Action {
  RequestIdentity = 0,
  RespondIdentity = 1,
  RequestPing = 2,
  RespondPing = 3,
}

export class RequestAbstract {
  public action: Action;

  constructor(action: Action) {
    this.action = action;
  }
}

export class RespondAbstract {
  public action: Action;

  constructor(action: Action) {
    this.action = action;
  }
}

export class RequestIdentity extends RequestAbstract {
  constructor() {
    super(Action.RequestIdentity);
  }
}

export class RespondIdentity extends RespondAbstract {
  serial: string;

  constructor(serial: string) {
    super(Action.RespondIdentity);

    this.serial = serial;
  }
}

export class RequestPing extends RequestAbstract {
  constructor() {
    super(Action.RequestPing);
  }
}

export class RespondPing extends RespondAbstract {
  constructor() {
    super(Action.RespondPing);
  }
}
