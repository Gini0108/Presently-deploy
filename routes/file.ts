import { Router } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { addFile, deleteFile } from "../controller/file.ts";
import { authenticationHandler } from "../middleware/authentication.ts";

const router = new Router();

router.prefix("/file");

router.post("/", authenticationHandler, addFile);

router.delete("/:filename", authenticationHandler, deleteFile);

export default router;
