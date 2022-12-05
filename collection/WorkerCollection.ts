import WorkerEntity from "../entity/WorkerEntity.ts";
import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.0/collection/BaseCollection.ts";

export default class WorkerCollection extends BaseCollection {
  public workers: WorkerEntity[] = [];
}
