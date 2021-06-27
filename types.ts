export interface User {
  hash: string;
  email: string;
  lastname: string;
  firstname: string;
}

export enum State {
  Closed = "closed",
  Running = "running",
  Viewing = "viewing",
  Editing = "editing",
}

export interface Stat {
  state: State;
  slides: number;
  position: number;
}

export interface Info {
  notes: Array<string>;
  titles: Array<string>;
}