import { Router } from "https://deno.land/x/oak/mod.ts";

import { authenticationHandler } from "../middleware/authentication.ts";
import { RequestError } from "../middleware/error.ts";

const router = new Router()
  .prefix("/powerpoint")
  .use(authenticationHandler);

router.get("/", () => {
  throw new RequestError("Not implemented", 501);
});

export default router;
