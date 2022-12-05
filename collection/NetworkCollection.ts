import NetworkEntity from "../entity/NetworkEntity.ts";
import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.0/collection/BaseCollection.ts";

export default class NetworkCollection extends BaseCollection {
  public networks: NetworkEntity[] = [];
}
