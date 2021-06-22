import { Router } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { generateOauth, validateOauth } from "../controller/oauth.ts";

const router = new Router();

router.prefix("/oauth");

router.get("/validate", validateOauth);
router.get("/generate", generateOauth);

export default router;