import { AuthenticationError } from "./error.ts";
import { initializeEnv } from "../helper.ts";
import { Context } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import {
  create,
  getNumericDate,
  Payload,
  verify,
} from "https://deno.land/x/djwt/mod.ts";

initializeEnv(["DENO_APP_JWT_SECRET"]);

export const authenticationHandler = async (
  { request, state }: Context,
  next: () => Promise<void>,
) => {
  const secret = Deno.env.get("DENO_APP_JWT_SECRET")!;
  const header = request.headers.get("Authorization");
  const token = header?.split(" ")[1];

  if (token) {
    const payload = await verify(
      token,
      secret,
      "HS512",
    ).catch(() => {
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
  return create(
    { alg: "HS512", typ: "JWT" },
    Object.assign(payload, { exp: getNumericDate(60 * 60) }),
    Deno.env.get("DENO_APP_JWT_SECRET")!,
  );
};
