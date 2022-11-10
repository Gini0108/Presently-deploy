import GeneralRouter from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/router/GeneralRouter.ts";
import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/controller/GeneralController.ts";

import WorkerEntity from "../entity/WorkerEntity.ts";
import WorkerCollection from "../collection/WorkerCollection.ts";

const workerController = new GeneralController(
  "worker",
  WorkerEntity,
  WorkerCollection,
);

const workerRouter = new GeneralRouter(
  workerController,
  "worker",
);

export default workerRouter.router;
