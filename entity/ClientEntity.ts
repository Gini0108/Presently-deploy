import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";
import {
  BooleanColumn,
  TimestampColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";

export default class ClientEntity extends BaseEntity {
  public title = new VarcharColumn("title", false);
  public serial = new VarcharColumn("serial");

  public heard = new TimestampColumn("heard", false);
  public called = new TimestampColumn("called", false);

  public online = new BooleanColumn("online", false, false);
}
