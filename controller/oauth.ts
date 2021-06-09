import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { OAuth2Client } from "https://deno.land/x/oauth2_client/mod.ts";
import { Database } from "https://deno.land/x/aloedb/mod.ts";
import { Payload } from "https://deno.land/x/djwt/mod.ts";

import { generateToken } from "../middleware/authentication.ts";
import { initializeEnv } from "../helper.ts";
import { User } from "../types.ts";
import { AuthenticationError } from "../middleware/error.ts";

// Load. env file
initializeEnv([
  "DENO_SITE_URL",
  "DENO_SITE_PORT",
  "DENO_GOOGLE_CLIENT_ID",
  "DENO_GOOGLE_CLIENT_SECRET",
]);

// Construct the user database
const database = new Database<User>("database/user.json");

const oauth2Client = new OAuth2Client({
  clientId: Deno.env.get("DENO_GOOGLE_CLIENT_ID")!,
  redirectUri: `${Deno.env.get("DENO_SITE_URL")!}:${Deno.env.get(
    "DENO_SITE_PORT",
  )!}/login`,
  clientSecret: Deno.env.get("DENO_GOOGLE_CLIENT_SECRET")!,

  tokenUri: "https://www.googleapis.com/oauth2/v4/token",
  authorizationEndpointUri: "https://accounts.google.com/o/oauth2/v2/auth",
  defaults: {
    scope: "openid email",
  },
});

const generateOauth = (
  { response }: { response: Response },
) => {
  const url = oauth2Client.code.getAuthorizationUri();

  response.status = 200;
  response.body = { url };
};

const validateOauth = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Exchange the authorization code for an access token
  const tokens = await oauth2Client.code.getToken(request.url);

  // Find the user using the ID from the URL
  const results = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokens.accessToken}`,
  );
  const parsed = await results.json();

  const email = { parsed };
  const user = await database.findOne({ email });

  // // If user couldn't be found or the password is incorrect
  if (!user) {
    throw new AuthenticationError("incorrect");
  }

  // // Generate a token using the email
  const token = await generateToken({ email: user.email } as Payload);

  response.status = 200;
  response.body = { token };
};

export { generateOauth, validateOauth };
