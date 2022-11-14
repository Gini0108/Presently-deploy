import WorkerEntity from "./entity/WorkerEntity.ts";

export interface Slide {
  key: string;
  size: number;
  updated: Date;
  download: string;
}

export interface Worker {
  socket: WebSocket;
  entity?: WorkerEntity;
  serial?: string;
  spacing?: number;
}

export enum Action {
  RequestVerification = 0,
  ResponseVerification = 1,
  RequestIdentity = 2,
  ResponseIdentity = 3,
  RequestStatus = 4,
  ResponseStatus = 5,
  RequestPing = 6,
  ResponsePing = 7,
  RequestOpen = 8,
  ResponseOpen = 9,
  RequestState = 10,
  ResponseState = 11,
  RequestSpacing = 12,
  ResponseSpacing = 13,
  RequestCover = 14,
  ResponseCover = 15,
}

export class RequestAbstract {
  public action: Action;

  constructor(action: Action) {
    this.action = action;
  }
}

export class ResponseAbstract {
  public action: Action;

  constructor(action: Action) {
    this.action = action;
  }
}

export class RequestIdentity extends RequestAbstract {
  uuid: string;
  secret: string;

  constructor(uuid: string, secret: string) {
    super(Action.RequestIdentity);

    this.uuid = uuid;
    this.secret = secret;
  }
}

export class ResponseIdentity extends ResponseAbstract {
  success: boolean;

  constructor(success: boolean) {
    super(Action.ResponseIdentity);

    this.success = success;
  }
}

export class RequestPing extends RequestAbstract {
  constructor() {
    super(Action.RequestPing);
  }
}

export class ResponsePing extends ResponseAbstract {
  constructor() {
    super(Action.ResponsePing);
  }
}

export class RequestOpen extends RequestAbstract {
  uuid: string;
  slides: Slide[];

  constructor(uuid: string, slides: Slide[]) {
    super(Action.RequestOpen);

    this.uuid = uuid;
    this.slides = slides;
  }
}

export class ResponseOpen extends ResponseAbstract {
  constructor() {
    super(Action.ResponseOpen);
  }
}

export class RequestState extends RequestAbstract {
  playing: boolean;

  constructor(playing: boolean) {
    super(Action.RequestState);

    this.playing = playing;
  }
}

export class ResponseState extends ResponseAbstract {
  constructor() {
    super(Action.ResponseState);
  }
}

export class RequestSpacing extends RequestAbstract {
  spacing: number;

  constructor(spacing: number) {
    super(Action.RequestSpacing);

    this.spacing = spacing;
  }
}

export class ResponseSpacing extends ResponseAbstract {
  constructor() {
    super(Action.ResponseSpacing);
  }
}

export class RequestCover extends RequestAbstract {
  constructor() {
    super(Action.RequestCover);
  }
}

export class ResponseCover extends ResponseAbstract {
  download: string;

  constructor(download: string) {
    super(Action.ResponseCover);

    this.download = download;
  }
}
