import { Application } from "https://deno.land/x/oak/mod.ts";

import userRouter from "./routes/user.ts";
import powerpointRouter from "./routes/powerpoint.ts";

import { errorHandler } from "./middleware/error.ts";

const app = new Application().use(errorHandler);

app.addEventListener("listen", () => {
  console.log("Listening for HTTP requests on port 5000");
});

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(powerpointRouter.routes());
app.use(powerpointRouter.allowedMethods());

app.listen({ port: 5000 });
