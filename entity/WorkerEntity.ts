import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";
import {
  BooleanColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";

export default class WorkerEntity extends BaseEntity {
  public title = new VarcharColumn("title", false);
  public online = new BooleanColumn("online", false, false);
}
