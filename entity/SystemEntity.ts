import BaseEntity from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/entity/BaseEntity.ts";

import {
  BooleanColumn,
  NumberColumn,
  VarcharColumn,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";

export default class SystemEntity extends BaseEntity {
  public file = new VarcharColumn("file", false);
  public index = new NumberColumn("index", false);
  public playing = new BooleanColumn("playing", false);
  public interval = new VarcharColumn("interval", false);
}
