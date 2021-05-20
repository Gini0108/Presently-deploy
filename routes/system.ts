import { Router } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { updateSystem } from "../controller/system.ts";
import { authenticationHandler } from "../middleware/authentication.ts";

const router = new Router();

router.prefix("/system");

router.post("/", authenticationHandler, updateSystem);

export default router;
