export interface File {
  size: number;
  name: string;

  accessed: Date;
  creation: Date;
  modified: Date;
}

export interface User {
  hash: string;
  email: string;

  lastname: string;
  firstname: string;
}
