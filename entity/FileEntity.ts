import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.1.0/entity/BaseEntity.ts";

import {
  IntColumn,
  UUIDColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.1.0/other/Columns.ts";

export default class FileEntity extends BaseEntity {
  public size = new IntColumn("size");
  public title = new VarcharColumn("title");
  public network = new UUIDColumn("network");

  public status = new VarcharColumn("status", false, "uploading");
  public reference = new UUIDColumn("process", false);
}
