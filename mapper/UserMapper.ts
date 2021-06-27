// deno-lint-ignore-file no-explicit-any

import { cleanHex } from "../helper.ts";

import UserEntity from "../entity/UserEntity.ts";
import InterfaceMapper from "./InterfaceMapper.ts";
import UserCollection from "../collection/UserCollection.ts";

export default class UserMapper implements InterfaceMapper {
  public mapObject(row: any): UserEntity {
    const user = new UserEntity();

    // Re-add the dashes to the UUID and lowercase the string
    user.uuid = cleanHex(row.uuid);

    // Transform the MySQL date string into a JavaScript Date object
    user.created = new Date(row.created);
    user.updated = new Date(row.updated);

    user.lastname = row.lastname;
    user.firstname = row.firstname;

    user.hash = row.hash;
    user.email = row.email;

    return user;
  }

  public mapArray(
    rows: Array<any>,
  ): Array<UserEntity> {
    const users = rows.map((row) => this.mapObject(row));

    return users;
  }

  public mapCollection(
    rows: Array<any>,
    offset: number,
    limit: number,
    total: number,
  ): UserCollection {
    const users = this.mapArray(rows);

    return {
      total,
      limit,
      offset,
      users,
    };
  }
}
