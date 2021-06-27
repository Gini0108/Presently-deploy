import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { Context } from "https://deno.land/x/oak@v7.6.3/mod.ts";
import { initializeEnv } from "./helper.ts";
import {
  AuthenticationError,
  BodyError,
  PropertyError,
  ResourceError,
  TypeError,
} from "./errors.ts";

// Initialize .env variables and make sure they are set
initializeEnv(['PRESENTLY_SERVER_JWT_SECRET']);

// Fetch the variables and convert them to right datatype
const secret = Deno.env.get("PRESENTLY_SERVER_JWT_SECRET")!;

export const authenticationHandler = async (ctx: Context, next: () => Promise<unknown>) => {
  // Get the JWT token from the Authorization header
  const header = ctx.request.headers.get("Authorization");
  const token = header?.split(" ")[1];

  if (token) {
    // Verify and decrypt the payload
    const payload = await verify(
      token,
      secret,
      "HS512",
    ).catch(() => {
      throw new AuthenticationError("incorrect");
    });

    // Store the users UUID
    ctx.state.uuid = payload.uuid;

    await next();
    return;
  }

  throw new AuthenticationError("missing");
};

export const errorHandler = async (ctx: Context, next: () => Promise<unknown>) => {
  await next().catch(
    (
      error:
        | TypeError
        | BodyError
        | PropertyError
        | ResourceError
        | AuthenticationError,
    ) => {
      ctx.response.status = error.statusError;
      ctx.response.body = {
        message: error.message,
      };
    },
  );
};