import { Router } from "https://deno.land/x/oak/mod.ts";
import { authenticationHandler } from "../middleware/authentication.ts";
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  loginUser,
} from "../controller/user.ts";

const router = new Router();

router.prefix("/user");

router.get("/", authenticationHandler, getUsers);
router.get("/:email", authenticationHandler, getUser);

router.post("/", authenticationHandler, addUser);
router.post("/login", loginUser);

router.delete("/:email", authenticationHandler, deleteUser);

export default router;
