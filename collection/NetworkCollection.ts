import NetworkEntity from "../entity/NetworkEntity.ts";
import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/main/collection/BaseCollection.ts";

export default class NetworkCollection extends BaseCollection {
  public networks: NetworkEntity[] = [];
}
