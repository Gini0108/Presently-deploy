import Server from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Server.ts";

import fileRouter from "./router/fileRouter.ts";

const server = new Server();

server.add(fileRouter);

server.listen();
