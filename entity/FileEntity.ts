import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";

import {
  BooleanColumn,
  VarcharColumn,
  TimestampColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";

export default class FileEntity extends BaseEntity {
  public filename = new VarcharColumn("filename");
  public filetype = new VarcharColumn("filetype");

  public played = new TimestampColumn("played", false);
  public process = new BooleanColumn("process", false);
  public converted = new VarcharColumn("converted", false);
}
