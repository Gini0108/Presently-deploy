import { errorHandler } from "./middleware.ts";
import { initializeEnv } from "./helper.ts";

import { Application } from "https://deno.land/x/oak@v7.6.3/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

import router from "./router.ts";

const application = new Application();

// Initialize .env variables and make sure they are set
initializeEnv([
  "PRESENTLY_SERVER_OAK_PORT",
]);

// Fetch the variables and convert them to right datatype
const port = parseInt(Deno.env.get("PRESENTLY_SERVER_OAK_PORT")!);

// Add error handler to Oak
application.use(errorHandler);
application.use(oakCors({ origin: "*" }));
application.use(router.allowedMethods());
application.use(router.routes());

application.listen({ port });
