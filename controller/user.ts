import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";
import { Payload } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { User } from "../types.ts";
import {
  isEmail,
  isLength,
  isPassword,
  initializeEnv,
  generateToken,
} from "../helper.ts";
import {
  AuthenticationError,
  BodyError,
  PropertyError,
  ResourceError,
} from "../errors.ts";
import {
  compareSync,
  hashSync,
} from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";


initializeEnv(["DENO_APP_DATABASE_FOLDER"]);

// Construct the user database
const folder = Deno.env.get("DENO_APP_DATABASE_FOLDER");
const database = new Database<User>(`${folder}\\user.json`);

const cleanUser = (user: User): Partial<User> => {
  // Filter out the password hash for safety
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
  // Make sure a body is provided
  if (!request.hasBody) throw new BodyError("missing");

  // Make sure the body is valid JSON
  const body = await request.body({ type: "json" });
  const value = await body.value.catch(() => {
    throw new BodyError("invalid");
  });

  // Transfer properties to constants
  const {
    email,
    password,
    lastname,
    firstname,
  } = value;

  // Make sure all required values are provided
  if (typeof email === "undefined") throw new PropertyError("missing", "email");
  if (typeof password === "undefined") {
    throw new PropertyError("missing", "password");
  }
  if (typeof lastname === "undefined") {
    throw new PropertyError("missing", "lastname");
  }
  if (typeof firstname === "undefined") {
    throw new PropertyError("missing", "firstname");
  }

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
  // Make sure a body is provided
  if (!request.hasBody) throw new BodyError("missing");

  // Make sure the body is valid JSON
  const body = await request.body({ type: "json" });
  const value = await body.value.catch(() => {
    throw new BodyError("invalid");
  });

  // Transfer properties to constants
  const {
    email,
    password,
  } = value;

  // Make sure all required values are provided
  if (typeof email === "undefined") throw new PropertyError("missing", "email");
  if (typeof password === "undefined") {
    throw new PropertyError("missing", "password");
  }

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
  // Fetch the email from the URL
  const email = params.email;

  // Remove the user using the email from the URL
  const result = await database.deleteOne({ email });

  // If the user doens't exists throw a resource missing error
  if (!result) throw new ResourceError("missing", "user");

  response.status = 200;
};

export { addUser, deleteUser, getUser, getUsers, loginUser };
