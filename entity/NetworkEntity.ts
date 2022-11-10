import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/entity/BaseEntity.ts";

import {
  BooleanColumn,
  IntColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/other/Columns.ts";

export default class NetworkEntity extends BaseEntity {
  public file = new VarcharColumn("file", false);
  public title = new VarcharColumn("title");

  public spacing = new IntColumn("spacing", false);
  public playing = new BooleanColumn("playing", false, false);
}
