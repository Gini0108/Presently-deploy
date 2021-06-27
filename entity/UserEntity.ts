import BaseEntity from "./BaseEntity.ts";

import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export default class UserEntity extends BaseEntity {
  public hash = ``;
  public email = ``;
  public lastname = ``;
  public firstname = ``;

  set password(password: string) {
    // Convert the password into a hash
    this.hash = bcrypt.hashSync(password);
  }
}
