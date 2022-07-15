import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";

import { VarcharColumn } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";

export default class ClientEntity extends BaseEntity {
  public title = new VarcharColumn("title", false);
}
