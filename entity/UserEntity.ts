import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/entity/BaseEntity.ts";

import {
  UUIDColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/other/Columns.ts";

export default class FileEntity extends BaseEntity {
  public network = new UUIDColumn("network");
  public firebase = new VarcharColumn("firebase");
}
