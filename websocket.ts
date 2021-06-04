import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.1/mod.ts";
import { initializeEnv } from "./helper.ts";
import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.1/mod.ts";
import { isPowerpoint } from "./helper.ts";
import { walkSync } from "https://deno.land/std@0.96.0/fs/mod.ts";

// Load. env file
initializeEnv(["DENO_APP_WEBSOCKET_PORT"]);

let files: Array<string> = [];
let slides: Array<string> = [];

// Load every .pptx file
function updateFiles() {
  files = [];

  for (const entry of walkSync("./powerpoint")) {
    if (entry.isFile && isPowerpoint(entry.name)) files.push(entry.name);
  }
}

const server = new WebSocketServer(Number(Deno.env.get("DENO_APP_WEBSOCKET_PORT")!));
const emmiter = new EventEmitter<{
  updateFile(): void;
  updateSlides(): void;
  updateClient(): void;
}>();

emmiter.on("updateFile", () => {
  updateFiles();
  emmiter.emit("updateClient");
});


server.on("connection", function (client: WebSocketClient) {
  emmiter.on("updateClient", () => {
    client.send(JSON.stringify({ files, slides }));
  });

  updateFiles();
  client.send(JSON.stringify({ files, slides }));
});

export { emmiter };
