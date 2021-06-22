import { initializeEnv } from "./helper.ts";
import { errorHandler } from "./middleware.ts";
import { Application } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.1/mod.ts";

import systemRouter from "./routes/system.ts";
import userRouter from "./routes/user.ts";
import oauthRouter from "./routes/oauth.ts";
import fileRouter from "./routes/file.ts";
import sleno from "./sleno.ts";

// Load. env file
initializeEnv([
  "DENO_APP_JWT_SECRET",
  "DENO_APP_REST_PORT",
  "DENO_APP_JWT_SECRET",
  "DENO_APP_WEBSOCKET_PORT",
  "DENO_APP_POWERPOINT_FOLDER",
  "DENO_APP_POWERPOINT_LOCATION",
]);

// Start Sleno
sleno.initializeSleno();

// Start the OAK REST API server
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
application.use(oauthRouter.routes());
application.use(systemRouter.routes());

application.use(userRouter.allowedMethods());
application.use(fileRouter.allowedMethods());
application.use(oauthRouter.allowedMethods());
application.use(systemRouter.allowedMethods());

application.listen({ port: Number(Deno.env.get("DENO_APP_REST_PORT")!) });
