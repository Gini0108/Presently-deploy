import Server from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.0/other/Server.ts";

import fileRouter from "./router/fileRouter.ts";
import userRouter from "./router/userRouter.ts";
import socketRouter from "./router/socketRouter.ts";
import workerRouter from "./router/workerRouter.ts";
import networkRouter from "./router/networkRouter.ts";

import { verifyFirebase } from "./middleware.ts";

const server = new Server();

server.add(socketRouter);

server.use(verifyFirebase);

server.add(fileRouter);
server.add(userRouter);
server.add(workerRouter);
server.add(networkRouter);

server.listen();
