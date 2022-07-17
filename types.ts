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
  RequestGoto = 6,
  RespondGoto = 7,
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

export class RequestOpen extends RequestAbstract {
  file: string;

  constructor(file: string) {
    super(Action.RequestOpen);

    this.file = file;
  }
}

export class RespondOpen extends RespondAbstract {
  constructor() {
    super(Action.RespondOpen);
  }
}

export class RequestGoto extends RequestAbstract {
  index: number;

  constructor(index: number) {
    super(Action.RequestGoto);

    this.index = index;
  }
}

export class RespondGoto extends RespondAbstract {
  constructor() {
    super(Action.RespondGoto);
  }
}
