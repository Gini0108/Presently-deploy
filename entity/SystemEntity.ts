import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";

import {
  BooleanColumn,
  IntColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";

export default class SystemEntity extends BaseEntity {
  public name = new VarcharColumn("name");
  public file = new VarcharColumn("file", false);

  public spacing = new IntColumn("spacing", false);
  public playing = new BooleanColumn("playing", false);
}
