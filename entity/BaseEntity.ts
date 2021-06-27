import { v4 } from "https://deno.land/std@0.91.0/uuid/mod.ts";

export default class BaseEntity {
  public uuid = ``;
  public created: Date = new Date();
  public updated: Date = new Date();

  constructor() {
    this.uuid = v4.generate();
  }
}
