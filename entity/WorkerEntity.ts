import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/main/entity/BaseEntity.ts";
import {
  BooleanColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/main/other/Columns.ts";

export default class WorkerEntity extends BaseEntity {
  public title = new VarcharColumn("title", false);
  public online = new BooleanColumn("online", false, false);
}
