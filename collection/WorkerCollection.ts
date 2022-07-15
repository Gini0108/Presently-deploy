import WorkerEntity from "../entity/WorkerEntity.ts";
import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/collection/BaseCollection.ts";

export default class WorkerCollection extends BaseCollection {
  public workers: WorkerEntity[] = [];
}
