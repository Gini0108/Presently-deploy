import { Router } from "https://deno.land/x/oak@v7.6.3/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";

import { initializeEnv } from "./helper.ts";
import { authenticationHandler } from "./middleware.ts";

import FileController from "./controller/FileController.ts";
import UserController from "./controller/UserController.ts";
import SystemController from "./controller/SystemController.ts";

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
const port = +Deno.env.get("PRESENTLY_SERVER_MYSQL_PORT")!;
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

const fileController = new FileController();
const userController = new UserController(client);
const systemController = new SystemController();

// "Protected" routes
router.get(
  "/user",
  authenticationHandler,
  userController.getCollection.bind(userController),
);

router.post(
  "/user",
  authenticationHandler,
  userController.addObject.bind(userController),
);

router.delete(
  "/user/:uuid",
  authenticationHandler,
  userController.removeObject.bind(userController),
);

router.post(
  "/file",
  authenticationHandler,
  fileController.addObject.bind(fileController),
);

router.delete(
  "/file/:filename",
  authenticationHandler,
  fileController.removeObject.bind(fileController),
);

router.post(
  "/system",
  authenticationHandler,
  systemController.addObject.bind(systemController),
);

// Public routes
router.post(
  "/user/login",
  userController.loginUser.bind(userController),
);

router.get(
  "/user/oauth2/generate",
  userController.generateOAuth2.bind(userController),
);

router.get(
  "/user/oauth2/validate",
  userController.validateOAuth2.bind(userController),
);

export default router;
