import GeneralRouter from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/router/GeneralRouter.ts";
import FileController from "../controller/FileController.ts";

const fileController = new FileController("file");
const fileRouter = new GeneralRouter(
  fileController,
  "file",
);

export default fileRouter.router;
