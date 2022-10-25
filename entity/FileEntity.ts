import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";

import {
  IntColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";

export default class FileEntity extends BaseEntity {
  public size = new IntColumn("size");
  public name = new VarcharColumn("name");

  public status = new VarcharColumn("status", false, "uploading");
  public reference = new VarcharColumn("process", false);
}
