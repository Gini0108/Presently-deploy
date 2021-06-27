import { errorHandler } from "./middleware.ts";
import { Application } from "https://deno.land/x/oak@v7.6.3/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

import router from "./router.ts";

const application = new Application();

// Add error handler to Oak
application.use(errorHandler);
application.use(oakCors({ origin: "*" }));
application.use(router.allowedMethods());
application.use(router.routes());

application.listen({ port: 42069 });
