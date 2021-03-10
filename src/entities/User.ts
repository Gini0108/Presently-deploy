import { compare } from "bcrypt";
import { v1 } from "uuid";
import { Database } from "../../modules/aloedb";
import { hash } from "bcrypt";

interface IUser {
    id: string;
    email: string;
    hash: string;
}

export class User {
    id: string;
    email: string;
    hash: string;

    static db = new Database<IUser>("./db/users.json");

    static async generate(
      email: string,
      password: string
    ): Promise<User | null> {
      if (await User.exists(email)) return null;

      const user = new User({
        id: v1(),
        email: email,
        hash: await hash(password, 4),
      });

      return user;
    }

    private static async exists(email: string) {
      const user = await User.db.findOne({ email: email });
      return user != null;
    }

    constructor(object: IUser) {
      this.id = object.id;
      this.email = object.email;
      this.hash = object.hash;
    }

    /**
     * Compair given password with stores user password
     *
     * @param {string} password The password that the user entered to login
     * @return {*}  {Promise<boolean>}
     * @memberof User
     */
    async compare(password: string): Promise<boolean> {
      return await compare(password, this.hash);
    }

    /**
     * Delete user
     *
     * @return {*}  {Promise<void>}
     * @memberof User
     */
    async delete(): Promise<void> {
      await User.db.deleteOne(this);
    }

    /**
     * Save User
     *
     * @return {*}  {Promise<void>}
     * @memberof User
     */
    async save(): Promise<void> {
      await User.db.insertOne(this);
    }

    publicData(): Partial<User> {
      return {
        id: this.id,
        email: this.email,
      };
    }
}
