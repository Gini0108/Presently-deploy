import GeneralRouter from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/router/GeneralRouter.ts";
import SystemController from "../controller/SystemController.ts";

const systemController = new SystemController("network");
const systemRouter = new GeneralRouter(
  systemController,
  "system",
);

export default systemRouter.router;
