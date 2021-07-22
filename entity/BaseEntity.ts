export default class BaseEntity {
  public uuid = ``;
  public created: Date = new Date();
  public updated: Date = new Date();

  constructor() {
    this.uuid = globalThis.crypto.randomUUID();
  }
}
