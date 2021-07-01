import { bodyValidation, errorHandler } from "./middleware.ts";
import { initializeEnv } from "./helper.ts";

import { Application } from "https://deno.land/x/oak@v7.6.3/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

import router from "./router.ts";
import master from "./master.ts";

// Initialize .env variables and make sure they are set
initializeEnv([
  "PRESENTLY_SERVER_PORT_OAK",
]);

// Initialize the master to manage slaves
master.initialize();

// Start the OAK REST API server
const port = +Deno.env.get("PRESENTLY_SERVER_PORT_OAK")!;
const application = new Application();

application.addEventListener("error", (error) => {
  console.log(error);
});

application.addEventListener("listen", () => {
  console.log(`Listening on port ${port}`);
});

application.use(errorHandler);
application.use(bodyValidation);

application.use(oakCors());
application.use(router.routes());
application.use(router.allowedMethods());

application.listen({ port });
