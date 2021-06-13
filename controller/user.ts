import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";
import { Payload } from "https://deno.land/x/djwt@v2.2/mod.ts";
import {
  compareSync,
  hashSync,
} from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

import { isEmail, isLength, isPassword } from "../helper.ts";
import { generateToken } from "../middleware/authentication.ts";
import { User } from "../types.ts";
import {
  AuthenticationError,
  BodyError,
  PropertyError,
  ResourceError,
} from "../middleware/error.ts";

// Construct the user database
const database = new Database<User>("database/user.json");

const cleanUser = (user: User): Partial<User> => {
  return {
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
  };
};

const getUsers = async (
  { response }: { response: Response },
) => {
  // Find every user and return it
  const users = await database.findMany();
  response.body = users.map((user) => cleanUser(user));
  response.status = 200;
};

const addUser = async (
  { request, response }: { request: Request; response: Response },
) => {
  if (!request.hasBody) throw new BodyError("missing");
  const body = await request.body({ type: "json" });
  const value = await body.value.catch(() => {
    throw new BodyError("invalid");
  });

  const email = value.email;
  const password = value.password;
  const lastname = value.lastname;
  const firstname = value.firstname;

  // Make sure all required values are provided
  if (!email) throw new PropertyError("missing", "email");
  if (!password) throw new PropertyError("missing", "password");
  if (!lastname) throw new PropertyError("missing", "lastname");
  if (!firstname) throw new PropertyError("missing", "firstname");

  // Make sure the properties are valid
  if (!isEmail(email)) throw new PropertyError("email", "email");
  if (!isLength(lastname)) throw new PropertyError("length", "lastname");
  if (!isLength(firstname)) throw new PropertyError("length", "firstname");
  if (!isPassword(password)) throw new PropertyError("password", "password");

  // Make sure the user doens't exist
  if (await database.findOne({ email })) {
    throw new ResourceError("duplicate", "user");
  }

  // Insert the user into the database
  const hash = hashSync(password);
  const user = await database.insertOne({ email, hash, lastname, firstname });

  response.status = 200;
  response.body = cleanUser(user);
};

const getUser = async (
  { params, response }: { params: { email: string }; response: Response },
) => {
  // Find the user using the ID from the URL
  const email = params.email;
  const user = await database.findOne({ email });

  // If the user doens't exists throw a resource missing error
  if (!user) throw new ResourceError("missing", "user");

  response.status = 200;
  response.body = cleanUser(user);
};

const loginUser = async (
  { request, response }: { request: Request; response: Response },
) => {
  if (!request.hasBody) throw new BodyError("missing");
  const body = await request.body({ type: "json" });
  const value = await body.value.catch(() => {
    throw new BodyError("invalid");
  });

  const email = value.email;
  const password = value.password;

  // Make sure all required values are provided
  if (!email) throw new PropertyError("missing", "email");
  if (!password) throw new PropertyError("missing", "password");

  // Make sure the properties are valid
  if (!isEmail(email)) throw new PropertyError("email", "email");

  const user = await database.findOne({ email });

  // If user couldn't be found or the password is incorrect
  if (!user || !compareSync(password, user.hash)) {
    throw new AuthenticationError("incorrect");
  }

  // Generate a token using the email
  const token = await generateToken({ email: user.email } as Payload);
  const { lastname, firstname } = user;

  response.status = 200;
  response.body = { token, lastname, firstname, email };
};

const deleteUser = async (
  { params, response }: { params: { email: string }; response: Response },
) => {
  const email = params.email;

  // Remove the user using the email from the URL
  const result = await database.deleteOne({ email });

  // If the user doens't exists throw a resource missing error
  if (!result) throw new ResourceError("missing", "user");

  response.status = 200;
};

export { addUser, deleteUser, getUser, getUsers, loginUser };
