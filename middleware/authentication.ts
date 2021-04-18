import { Context } from "https://deno.land/x/oak/mod.ts";
import { RequestError } from "./error.ts";
import { create, Payload, verify } from "https://deno.land/x/djwt/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const jwtSecret = config().JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET environment variable must be set!");

export const authenticationHandler = async (
  { request, state }: Context,
  next: () => Promise<void>,
) => {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (token) {
    const payload = await verify(token, jwtSecret, "HS512").catch(() => {
      throw new RequestError("User authentication token has expired", 403);
    });

    state.userId = payload.id;
    await next();
  } else {
    throw new RequestError("User is not authorized", 401);
  }
};

export const generateToken = (payload: Payload) => {
  return create({ alg: "HS512", typ: "JWT" }, payload, jwtSecret); // TODO: Might want to add an expiration timestamp
};
