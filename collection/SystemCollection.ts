import SystemEntity from "../entity/SystemEntity.ts";
import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/collection/BaseCollection.ts";

export default class SystemCollection extends BaseCollection {
  public systems: SystemEntity[] = [];
}
