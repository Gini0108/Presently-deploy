import FileController from "../controller/FileController.ts";
import GeneralRouter from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/router/GeneralRouter.ts";

const fileController = new FileController("file");
const fileRouter = new GeneralRouter(
  fileController,
  "file",
);

const addStatus = fileController.addObjectStatus.bind(fileController);

// Add the custom route for the file status
fileRouter.router.post("/entity/:uuid/status", addStatus);

export default fileRouter.router;
