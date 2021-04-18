import { Database } from 'https://deno.land/x/aloedb/mod.ts'
import { hash, compare } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { generateToken } from "../middleware/authentication.ts";
import { Payload } from "https://deno.land/x/djwt/mod.ts"

export interface IUser {
    id: string
    email: string
    hash: string
}

const db = new Database<IUser>("db/user.json");

export class User implements IUser {
    id;
    email;
    hash;

    constructor(data: Omit<IUser, "id"> & {id?: string}) {
        this.id = data.id ?? v4.generate();
        this.email = data.email;
        this.hash = data.hash;
    }

    save() {
        return db.updateOne({id: this.id}, this);
    }

    delete() {
        return db.deleteOne({id: this.id});
    }

    authorize() {
        return generateToken({id: this.id} as Payload);
    }

    checkPassword(password: string) {
        return compare(password, this.hash);
    }

    static async fromScratch(email: string, password: string) {
        const user = new User({email: email, hash: await hash(password)});
        await db.insertOne(user);
        return user;
    }

    static async findOne(user: Partial<IUser>) {
        const userData = await db.findOne(user);
        if (!userData) return;
        return new User(userData);
    }
}