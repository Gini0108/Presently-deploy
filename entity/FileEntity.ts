import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";

import { VarcharColumn } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";

export default class FileEntity extends BaseEntity {
  public name = new VarcharColumn("name", false);
  public type = new VarcharColumn("type", false);
}
