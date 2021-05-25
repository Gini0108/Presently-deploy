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

for (const entry of walkSync("./powerpoint")) {
  if (entry.isFile && isPowerpoint(entry.name)) files.push(entry.name);
}

const server = new WebSocketServer(Number(Deno.env.get("DENO_APP_WEBSOCKET_PORT")!));
const emmiter = new EventEmitter<{
  addedEvent(filename: string): void;
  removedEvent(filename: string): void;

  addedProcessed(): void;
  removedProcessed(): void;
}>();

emmiter.on("addedEvent", (filename: string) => {
  files.push(filename);

  emmiter.emit("addedProcessed");
});

emmiter.on("removedEvent", (filename: string) => {
  const index = files.indexOf(filename);

  if (index !== -1) {
    files.splice(index, 1);
  }

  emmiter.emit("removedProcessed");
});

server.on("connection", function (client: WebSocketClient) {
  emmiter.on("addedProcessed", () => {
    client.send(JSON.stringify({ files }));
  });

  emmiter.on("removedProcessed", () => {
    client.send(JSON.stringify({ files }));
  });

  client.send(JSON.stringify({ files }));
});

export { emmiter };
