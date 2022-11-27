import GeneralRouter from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.1.0/router/GeneralRouter.ts";
import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.1.0/controller/GeneralController.ts";

import UserEntity from "../entity/UserEntity.ts";
import UserCollection from "../collection/UserCollection.ts";

const userController = new GeneralController(
  "user",
  UserEntity,
  UserCollection,
  {
    key: "network",
    type: "uuidv4",
    value: "network",
  },
);

const userRouter = new GeneralRouter(
  userController,
  "user",
);

export default userRouter.router;
