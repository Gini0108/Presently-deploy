import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { OAuth2Client } from "https://deno.land/x/oauth2_client@v0.2.1/mod.ts";
import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";
import { Payload } from "https://deno.land/x/djwt@v2.2/mod.ts";

import { generateToken } from "../helper.ts";
import { initializeEnv } from "../helper.ts";
import { User } from "../types.ts";

// Load. env file
initializeEnv([
  "DENO_SITE_URL",
  "DENO_GOOGLE_CLIENT_ID",
  "DENO_GOOGLE_CLIENT_SECRET",
]);

// Construct the user database
const folder = Deno.env.get("DENO_APP_DATABASE_FOLDER");
const database = new Database<User>(`${folder}\\user.json`);

const oauth2Client = new OAuth2Client({
  clientId: Deno.env.get("DENO_GOOGLE_CLIENT_ID")!,
  redirectUri: `http://${Deno.env.get("DENO_SITE_URL")!}:${Deno.env.get(
    "DENO_APP_REST_PORT",
  )!}/oauth/validate`,
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

  const params = new URLSearchParams();
  const email = parsed.email;
  const user = await database.findOne({ email });

  // If user couldn't be found or the password is incorrect
  if (!parsed.verified_email || !user) {
    params.append('error', `It appears there isn't a user with "${email}" as an email address`);
    response.redirect(`http://localhost:8080/?${params.toString()}`);
    return;
  }

  // Generate a token using the email
  const token = await generateToken({ email: user.email } as Payload);

  params.append('token', token);
  params.append('email', user.email);
  params.append('lastname', user.lastname);
  params.append('firstname', user.firstname);

  response.redirect(`http://localhost:8080/?${params.toString()}`);
  return;
};

export { generateOauth, validateOauth };