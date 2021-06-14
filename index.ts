import { ensureDirSync } from "https://deno.land/std@0.93.0/fs/mod.ts";
import { initializeEnv } from "./helper.ts";

// Make sure the required folders exist
ensureDirSync("./database");
ensureDirSync("./powerpoint");

// Load. env file
initializeEnv([
  "DENO_APP_REST_PORT",
  "DENO_APP_JWT_SECRET",
  "DENO_APP_WEBSOCKET_PORT",
]);

import { errorHandler } from "./middleware/error.ts";
import { Application } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.1/mod.ts";

import systemRouter from "./routes/system.ts";
import userRouter from "./routes/user.ts";
import fileRouter from "./routes/file.ts";

import slenosafe from "./slenosafe.ts";

const application = new Application();

application.addEventListener("error", (error) => {
  console.log(error);
});

application.addEventListener("listen", () => {
  console.log(`Listening on port ${Deno.env.get("DENO_APP_REST_PORT")!}`);
});

application.use(oakCors());
application.use(errorHandler);

application.use(userRouter.routes());
application.use(fileRouter.routes());
application.use(systemRouter.routes());

application.use(userRouter.allowedMethods());
application.use(fileRouter.allowedMethods());
application.use(systemRouter.allowedMethods());

application.listen({ port: Number(Deno.env.get("DENO_APP_REST_PORT")!) });

await slenosafe.initializeSleno();
