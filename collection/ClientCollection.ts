import ClientEntity from "../entity/ClientEntity.ts";
import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/collection/BaseCollection.ts";

export default class ClientCollection extends BaseCollection {
  public clients: ClientEntity[] = [];
}
