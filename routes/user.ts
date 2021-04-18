import { Router } from "https://deno.land/x/oak/mod.ts";

import { RequestError } from "../middleware/error.ts";
import { User } from "../entities/User.ts";
import { authenticationHandler } from "../middleware/authentication.ts";

const router = new Router().prefix("/user");

const inputValidator = (email: string, password: string) => {
  if (!email || !email.includes("@") || email.length > 40) {
    throw new RequestError("A valid email must be provided!", 400);
  }
  if (
    !password || email == password || password.length < 5 ||
    password.length > 128
  ) {
    throw new RequestError(
      "A valid password must be provided!",
      400,
      "Password can not be the same as the email address, must have a minimum length of 5 and a maximum length of 128",
    );
  }
};

router.get("/", authenticationHandler, async ({ response, state }) => {
  const user = await User.findOne({ id: state.userId });
  if (!user) {
    throw new RequestError("Requested user does no longer exist.", 404);
  }
  response.body = { id: user.id, email: user.email };
});

router.post("/create", authenticationHandler, async ({ request, response }) => {
  const body = await request.body({ type: "json" }).value;

  const email: string = body.email;
  const password: string = body.password;

  inputValidator(email, password);

  if (await User.findOne({ email })) {
    throw new RequestError(
      "There is already an existing account for this email.",
      409,
    );
  }

  const user = await User.fromScratch(email, password);
  response.body = { id: user.id, email: user.email };
});

router.post("/login", async ({ request, response }) => {
  const body = await request.body({ type: "json" }).value;

  const email: string = body.email;
  const password: string = body.password;

  inputValidator(email, password);

  const user = await User.findOne({ email });
  if (!user || !await user.checkPassword(password)) {
    throw new RequestError("Incorrect email or password.", 400);
  }

  response.body = { token: await user.authorize() };
});

export default router;
