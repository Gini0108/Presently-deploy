import { Router } from "https://deno.land/x/oak@v7.6.3/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";

import { initializeEnv } from "./helper.ts";
import { authenticationHandler } from "./middleware.ts";

import UserController from "./classes/controller/UserController.ts";

// Initialize .env variables and make sure they are set
initializeEnv([
  "PRESENTLY_SERVER_MYSQL_HOST",
  "PRESENTLY_SERVER_MYSQL_USER",
  "PRESENTLY_SERVER_MYSQL_PASS",
  "PRESENTLY_SERVER_MYSQL_PORT",
  "PRESENTLY_SERVER_MYSQL_BASE",
]);

// Fetch the variables and convert them to right datatype
const hostname = Deno.env.get("PRESENTLY_SERVER_MYSQL_HOST")!;
const username = Deno.env.get("PRESENTLY_SERVER_MYSQL_USER")!;
const password = Deno.env.get("PRESENTLY_SERVER_MYSQL_PASS")!;
const port = parseInt(Deno.env.get("PRESENTLY_SERVER_MYSQL_PORT")!);
const db = Deno.env.get("PRESENTLY_SERVER_MYSQL_BASE")!;

const router = new Router();
const client = new Client();

// Connect to MySQL server
await client.connect({
  hostname,
  username,
  password,
  port,
  db,
});

const userController = new UserController(client);

router.prefix("/user");

// "Protected" routes
router.get(
  "/",
  authenticationHandler,
  userController.getCollection.bind(userController),
);

router.post(
  "/",
  authenticationHandler,
  userController.addObject.bind(userController),
);

router.delete(
  "/:uuid",
  authenticationHandler,
  userController.removeObject.bind(userController),
);

// Public routes
router.post(
  "/login",
  userController.loginUser.bind(userController)
);

export default router;
