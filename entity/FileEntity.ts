import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/main/entity/BaseEntity.ts";

import {
  IntColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/main/other/Columns.ts";

export default class FileEntity extends BaseEntity {
  public size = new IntColumn("size");
  public name = new VarcharColumn("name");

  public status = new VarcharColumn("status", false, "uploading");
  public reference = new VarcharColumn("process", false);
}
