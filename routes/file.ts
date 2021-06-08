import { Router } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { addFile, deleteFile } from "../controller/file.ts";
// import { authenticationHandler } from "../middleware/authentication.ts";

const router = new Router();

router.prefix("/file");

router.post("/", addFile);

router.delete("/:filename", deleteFile);

export default router;
