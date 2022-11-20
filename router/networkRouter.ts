import GeneralRouter from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.3/router/GeneralRouter.ts";
import NetworkController from "../controller/NetworkController.ts";

const networkController = new NetworkController("network");
const networkRouter = new GeneralRouter(
  networkController,
  "network",
);

export default networkRouter.router;
