import GeneralRouter from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.4/router/GeneralRouter.ts";
import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.4/controller/GeneralController.ts";

import UserEntity from "../entity/UserEntity.ts";
import UserCollection from "../collection/UserCollection.ts";

const userController = new GeneralController(
  "user",
  UserEntity,
  UserCollection,
);

const userRouter = new GeneralRouter(
  userController,
  "user",
);

export default userRouter.router;
