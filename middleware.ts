import { Context } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
import {
  AuthenticationError,
  BodyError,
  PropertyError,
  ResourceError,
  TypeError,
} from "./errors.ts";

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

export const errorHandler = async (
  { response }: Context,
  next: () => Promise<void>,
) => {
  await next().catch(
    (
      error:
        | TypeError
        | BodyError
        | PropertyError
        | ResourceError
        | AuthenticationError,
    ) => {
      response.status = error.statusError;
      response.body = {
        message: error.message,
      };
    },
  );
};
