import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { compareSync } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { OAuth2Client } from "https://deno.land/x/oauth2_client@v0.2.1/mod.ts";
import { create, Payload } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { Request, Response } from "https://deno.land/x/oak@v7.6.3/mod.ts";

import { initializeEnv, isEmail, isLength, isPassword } from "../helper.ts";
import { AuthenticationError, PropertyError, TypeError } from "../errors.ts";

import UserEntity from "../entity/UserEntity.ts";
import UserRepository from "../repository/UserRepository.ts";
import InterfaceController from "./InterfaceController.ts";

// Initialize .env variables and make sure they are set
initializeEnv([
  "PRESENTLY_SERVER_JWT_SECRET",
  "PRESENTLY_SERVER_OAUTH_TARGET",
  "PRESENTLY_SERVER_OAUTH_REDIRECT",
  "PRESENTLY_SERVER_GOOGLE_ID",
  "PRESENTLY_SERVER_GOOGLE_SECRET",
]);

// Fetch the variables and convert them to right datatype
const secret = Deno.env.get("PRESENTLY_SERVER_JWT_SECRET")!;
const clientId = Deno.env.get("PRESENTLY_SERVER_GOOGLE_ID")!;
const targetUri = Deno.env.get("PRESENTLY_SERVER_OAUTH_TARGET")!;
const redirectUri = Deno.env.get("PRESENTLY_SERVER_OAUTH_REDIRECT")!;
const clientSecret = Deno.env.get("PRESENTLY_SERVER_GOOGLE_SECRET")!;

// These variables are somewhat fixed so just hardcode them
const oauthConfig = {
  tokenUri: "https://www.googleapis.com/oauth2/v4/token",
  authorizationEndpointUri: "https://accounts.google.com/o/oauth2/v2/auth",
  defaults: {
    scope: "openid email",
  },
};

const cleanUser = (user: UserEntity): Partial<UserEntity> => {
  return {
    uuid: user.uuid,
    email: user.email,
    updated: user.updated,
    created: user.created,
    lastname: user.lastname,
    firstname: user.firstname,
  };
};

const generateToken = (payload: Payload) => {
  return create(
    {
      typ: "JWT",
      alg: "HS512",
    },
    payload,
    secret,
  );
};

export default class UserController implements InterfaceController {
  private userRepository: UserRepository;
  private oauth2Client: OAuth2Client;

  constructor(client: Client) {
    this.userRepository = new UserRepository(client);
    this.oauth2Client = new OAuth2Client({
      clientId,
      redirectUri,
      clientSecret,
      ...oauthConfig,
    });
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch the body parameters
    const body = await request.body();
    const value = await body.value;

    // Make sure the required properties are provided
    if (typeof value.email === "undefined") {
      throw new PropertyError("missing", "email");
    }
    if (typeof value.password === "undefined") {
      throw new PropertyError("missing", "password");
    }
    if (typeof value.lastname === "undefined") {
      throw new PropertyError("missing", "lastname");
    }
    if (typeof value.firstname === "undefined") {
      throw new PropertyError("missing", "firstname");
    }

    // Make sure the required properties are the right type
    if (typeof value.email !== "string") throw new TypeError("string", "email");
    if (typeof value.password !== "string") {
      throw new TypeError("string", "password");
    }
    if (typeof value.lastname !== "string") {
      throw new TypeError("string", "lastname");
    }
    if (typeof value.firstname !== "string") {
      throw new TypeError("string", "firstname");
    }

    // Make sure the properties are valid
    if (!isEmail(value.email)) throw new PropertyError("email", "email");
    if (!isLength(value.lastname)) {
      throw new PropertyError("length", "lastname");
    }
    if (!isLength(value.firstname)) {
      throw new PropertyError("length", "firstname");
    }
    if (!isPassword(value.password)) {
      throw new PropertyError("password", "password");
    }

    // Create the UserEntity object
    const user = new UserEntity();

    user.email = value.email;
    user.password = value.password;
    user.lastname = value.lastname;
    user.firstname = value.firstname;

    // Insert into the database the store the result
    const result = await this.userRepository.addObject(user);
    const clean = cleanUser(result);

    response.body = clean;
    response.status = 200;
  }

  async getCollection(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch variables from URL GET parameters
    let limit = request.url.searchParams.get(`limit`)
      ? request.url.searchParams.get(`limit`)
      : 5;

    let offset = request.url.searchParams.get(`offset`)
      ? request.url.searchParams.get(`offset`)
      : 0;

    // Validate limit and offset are numbers
    if (isNaN(+limit!)) throw new TypeError("number", "limit");
    if (isNaN(+offset!)) throw new TypeError("number", "offset");

    // Transform the strings into numbers
    limit = Number(limit);
    offset = Number(offset);

    // Filter out the hash and password from the UserEntity
    const result = await this.userRepository.getCollection(offset, limit);
    const total = result.total;
    const users = result.users.map((user) => cleanUser(user));

    // Return results to the user
    response.status = 200;
    response.body = {
      total,
      limit,
      offset,
      users,
    };
  }

  async removeObject(
    { params, response }: { params: { uuid: string }; response: Response },
  ) {
    // Remove the user using the UUID from the URL
    const result = await this.userRepository.removeObject(params.uuid);

    response.status = result ? 204 : 404;
  }

  async loginUser(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch the body parameters
    const body = await request.body();
    const value = await body.value;

    // Make sure all required values are provided
    if (typeof value.email === "undefined") {
      throw new PropertyError("missing", "email");
    }
    if (typeof value.password === "undefined") {
      throw new PropertyError("missing", "password");
    }

    // Make sure the required properties are the right type
    if (typeof value.email !== "string") throw new TypeError("string", "email");
    if (typeof value.password !== "string") {
      throw new TypeError("string", "password");
    }

    const user = await this.userRepository.getObjectByEmail(value.email);
    const clean = cleanUser(user);

    // If user couldn't be found or the password is incorrect
    if (!user || !compareSync(value.password, user.hash)) {
      throw new AuthenticationError("incorrect");
    }

    // Generate token using public user properties
    const token = await generateToken(clean as Payload);

    // Send relevant information back to the user
    response.status = 200;
    response.body = {
      token,
      ...clean,
    };
  }

  generateOAuth2(
    { response }: { request: Request; response: Response },
  ) {
    const url = this.oauth2Client.code.getAuthorizationUri();

    response.status = 200;
    response.body = { url };
  }

  async validateOAuth2(
    { request, response }: { request: Request; response: Response },
  ) {
    // Exchange the authorization code for an access token
    const tokens = await this.oauth2Client.code.getToken(request.url);

    // Find the user using the ID from the URL
    const results = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokens.accessToken}`,
    );
    const parsed = await results.json();

    const user = await this.userRepository.getObjectByEmail(parsed.email);
    const clean = cleanUser(user);
    const params = new URLSearchParams();

    // If there is no user with this email
    if (!user) {
      params.append(
        "error",
        "There is no Presently account associated with this Google Account.",
      );
      response.redirect(`${targetUri}/?${params.toString()}`);
      return;
    }

    // If the user isn't verified
    if (parsed.verified_email) {
      params.append("error", `Your Google account email isn't verified.`);
      response.redirect(`${targetUri}/?${params.toString()}`);
      return;
    }

    // Generate token using public user properties
    const token = await generateToken(clean as Payload);

    // Append the relevant information to the redirect URL
    params.append("uuid", user.uuid);
    params.append("token", token);
    params.append("email", user.email);
    params.append("lastname", user.lastname);
    params.append("firstname", user.firstname);

    response.redirect(`${targetUri}/?${params.toString()}`);
    return;
  }
}
