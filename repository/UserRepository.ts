import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { ResourceError } from "../errors.ts";

import UserEntity from "../entity/UserEntity.ts";
import UserMapper from "../mapper/UserMapper.ts";
import UserCollection from "../collection/UserCollection.ts";
import InterfaceRepository from "./RepositoryInterface.ts";

export default class UserRepository implements InterfaceRepository {
  private userMapper: UserMapper;
  private client: Client;

  constructor(client: Client) {
    this.client = client;

    this.userMapper = new UserMapper();
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<UserCollection> {
    // Get users from the database with the given offset and limit
    const rowsResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, email, firstname, lastname, hash, created, updated FROM users LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    // Count the total amount of users stored in the database
    const totalResult = await this.client.execute(
      `SELECT COUNT(uuid) AS total from users`,
    );

    // Map the database rows into a proper array of Users
    const rows = rowsResult.rows!;
    const total = totalResult.rows![0].total;

    return this.userMapper.mapCollection(rows, offset, limit, total);
  }

  public async getObject(uuid: string): Promise<UserEntity | null> {
    // Get the user from the database by its UUID
    const rowResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, email, firstname, lastname, hash, created, updated FROM users WHERE uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // If no row is found return null
    if (typeof rowResult.rows === "undefined" || rowResult.rows.length === 0) {
      return null;
    }

    // Map the database row into a single User object
    const row = rowResult.rows![0];
    return this.userMapper.mapObject(row);
  }

  public async getObjectByEmail(email: string): Promise<UserEntity | null> {
    // Get the user from the database by its email
    const rowResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, email, firstname, lastname, hash, created, updated FROM users WHERE email = '${email}'`,
    );

    // If no row is found return null
    if (typeof rowResult.rows === "undefined" || rowResult.rows.length === 0) {
      return null;
    }

    // Map the database row into a single User object
    const row = rowResult.rows![0];
    return this.userMapper.mapObject(row);
  }

  public async addObject(object: UserEntity): Promise<UserEntity> {
    // Insert the user into the database
    await this.client.execute(
      `INSERT INTO users (uuid, email, firstname, lastname, hash) VALUES(UNHEX(REPLACE('${object.uuid}', '-', '')), '${object.email}', '${object.firstname}', '${object.lastname}', '${object.hash}')`,
    ).catch((error: Error) => {
      const message = error.message;
      const ending = message.slice(-21);

      // If the email is a duplicate
      if (ending === "for key 'users.email'") {
        throw new ResourceError("duplicate", "user");
      }

      // Otherwise just throw the error
      throw error;
    });

    // Fetch the object from the database to get the TIMESTAMPs
    const result = await this.getObject(object.uuid);
    return result!;
  }

  public async removeObject(uuid: string): Promise<boolean> {
    // Delete the user from the database by its UUID
    const deleteResult = await this.client.execute(
      `DELETE FROM users WHERE uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // Simplify the result to a boolean
    return deleteResult.affectedRows === 0 ? false : true;
  }
}
