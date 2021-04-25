import { Application } from "https://deno.land/x/oak/mod.ts";
import { initializeEnv } from "./helper.ts"
import { ensureDirSync } from "https://deno.land/std@0.93.0/fs/mod.ts";

import userRouter from "./routes/user.ts";
import fileRouter from "./routes/file.ts";

// Make sure the required folders exist
ensureDirSync("./database");
ensureDirSync("./powerpoint");

// Load. env file
initializeEnv(['JWT_SECRET']);

const app = new Application();

app.addEventListener("listen", () => {
  console.log("Listening for HTTP requests on port 5000");
});

app.addEventListener("error", (error) => {
  console.log(error);
});

app.use(userRouter.routes());
app.use(fileRouter.routes());

app.use(userRouter.allowedMethods());
app.use(fileRouter.allowedMethods());

app.listen({ port: 5000 });
