import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/entity/BaseEntity.ts";
import {
  BooleanColumn,
  UUIDColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/other/Columns.ts";

export default class WorkerEntity extends BaseEntity {
  public title = new VarcharColumn("title");
  public secret = new VarcharColumn("secret");
  public online = new BooleanColumn("online", false, false);
  public network = new UUIDColumn("network");
}
