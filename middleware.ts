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
initializeEnv(["PRESENTLY_SERVER_JWT_SECRET"]);

// Fetch the variables and convert them to right datatype
const secret = Deno.env.get("PRESENTLY_SERVER_JWT_SECRET")!;

export const authenticationHandler = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
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

export const bodyValidation = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  if (ctx.request.method === "POST") {
    // Make sure every POST request has a body
    if (!ctx.request.hasBody) throw new BodyError("missing");

    // Make sure every POST body is valid JSON
    const body = ctx.request.body({ type: "json" });
    await body.value.catch(() => {
      throw new BodyError("invalid");
    });
  }

  await next();
  return;
};

export const errorHandler = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  await next().catch(
    (
      error:
        | TypeError
        | PropertyError
        | ResourceError
        | AuthenticationError,
    ) => {
      // Log error to server
      console.log(error.stack);

      // Send error to user
      ctx.response.status = error.statusError;
      ctx.response.body = {
        message: error.message,
      };
    },
  );
};
