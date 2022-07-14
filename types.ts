import ClientEntity from "./entity/ClientEntity.ts";

export interface Client {
  socket: WebSocket;
  entity?: ClientEntity;
  serial?: string;
  interval?: number,
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
  heard: number;

  constructor(heard: number) {
    super(Action.RespondPing);

    this.heard = heard;
  }
}

// export interface Open extends Update {
//   action: Action.Goto;
//   powerpoint: string;
// }

// export interface Ping extends Update {
//   time: number;
//   action: Action.Goto;
// }

// export interface Playing extends Update {
//   action: Action.Goto;
//   playing: boolean;
//   powerpoint: string;
// }

// export interface Subscribe extends Update {
//   action: Action.Goto;
//   unique: string;
// }

// export interface Goto extends Update {
//   index: number;
//   action: Action.Goto;
//   powerpoint: string;
// }

// export interface Interval extends Update {
//   time: number;
//   index: number;
//   action: Action.Goto;
//   interval: number;
//   powerpoint: string;
// }

