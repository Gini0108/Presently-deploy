import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";
import { ensureDirSync } from "https://deno.land/std@0.93.0/fs/mod.ts";

import userRouter from "./routes/user.ts";
import fileRouter from "./routes/file.ts";

// Load .env file
config({ export: true });

// Make sure required variables are set
if (!Deno.env.get("JWT_SECRET")) {
  throw new Error("JWT_SECRET .env variable must be set.");
}

// Make sure the required folders exist
ensureDirSync("./database");
ensureDirSync("./powerpoint");

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
