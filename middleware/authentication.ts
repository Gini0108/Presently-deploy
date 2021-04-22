import { create, Payload, verify, getNumericDate } from "https://deno.land/x/djwt/mod.ts";
import { AuthenticationError } from "./error.ts";
import { Context, } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load .env file
config({ export: true });

// Make sure required variables are set
if (!Deno.env.get("JWT_SECRET")) {
  throw new Error("JWT_SECRET .env variable must be set.");
}

const jwtSecret = Deno.env.get("JWT_SECRET")!;

export const authenticationHandler = async (
  { request, state }: Context,
  next: () => Promise<void>,
) => {
  const header = request.headers.get("Authorization");
  const token = header?.split(" ")[1];

  if (token) {
    const payload = await verify(token, jwtSecret, "HS512").catch(() => {
      throw new AuthenticationError("expired");
    });

    state.email = payload.email;

    await next();
    return;
  }

  throw new AuthenticationError("missing");
};

export const generateToken = (payload: Payload) => {
  // Add expiration time as NumericDate, expiration time is in seconds.
  return create({ alg: "HS512", typ: "JWT" }, Object.assign(payload, { exp: getNumericDate(60 * 60 ) }), jwtSecret);
};
