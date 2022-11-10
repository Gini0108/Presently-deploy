import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/main/entity/BaseEntity.ts";

import {
  BooleanColumn,
  IntColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/main/other/Columns.ts";

export default class NetworkEntity extends BaseEntity {
  public name = new VarcharColumn("name");
  public file = new VarcharColumn("file", false);

  public spacing = new IntColumn("spacing", false);
  public playing = new BooleanColumn("playing", false, false);
}
