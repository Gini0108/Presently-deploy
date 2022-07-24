import Server from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Server.ts";

import systemRouter from "./router/systemRouter.ts";
import socketRouter from "./router/socketRouter.ts";
import fileRouter from "./router/fileRouter.ts";

const server = new Server();

server.add(fileRouter);
server.add(systemRouter);
server.add(socketRouter);

server.listen();
