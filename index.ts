import Server from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Server.ts";

import fileRouter from "./router/fileRouter.ts";
import socketRouter from "./router/socketRouter.ts";
import systemRouter from "./router/systemRouter.ts";

const server = new Server();

server.add(fileRouter);
server.add(socketRouter);
server.add(systemRouter);

server.listen();
