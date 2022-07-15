import WorkerEntity from "./entity/WorkerEntity.ts";

export interface Worker {
  socket: WebSocket;
  entity?: WorkerEntity;
  serial?: string;
  interval?: number;
}

export enum Action {
  RequestIdentity = 0,
  RespondIdentity = 1,
  RequestPing = 2,
  RespondPing = 3,
  RequestOpen = 4,
  RespondOpen = 5,
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

export class RequestOpen extends RequestAbstract {
  filename: string;
  location: string;

  constructor(filename: string, location: string) {
    super(Action.RequestOpen);

    this.filename = filename;
    this.location = location;
  }
}

export class RespondOpen extends RespondAbstract {
  constructor() {
    super(Action.RespondOpen);
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
