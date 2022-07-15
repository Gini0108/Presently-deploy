import GeneralRouter from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/router/GeneralRouter.ts";
import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/GeneralController.ts";

import ClientEntity from "../entity/ClientEntity.ts";
import ClientCollection from "../collection/ClientCollection.ts";

const clientController = new GeneralController(
  "client",
  ClientEntity,
  ClientCollection,
);

const clientRouter = new GeneralRouter(
  clientController,
  "client",
);

export default clientRouter.router;
