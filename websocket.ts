import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.2/mod.ts";
import slenosafe from "./slenosafe.ts";
import { initializeEnv } from "./helper.ts";
import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.1/mod.ts";
import { isPowerpoint } from "./helper.ts";
import { walkSync } from "https://deno.land/std@0.96.0/fs/mod.ts";

// Load. env file
initializeEnv(["DENO_APP_WEBSOCKET_PORT"]);

let files: Array<string> = [];

// Load every .pptx file
function updateFiles() {
  files = [];

  for (const entry of walkSync("./powerpoint")) {
    if (entry.isFile && isPowerpoint(entry.name)) files.push(entry.name);
  }
}

// Gather every system variable
function generateSystem() {
  return {
    files,
    index: slenosafe.stat ? slenosafe.stat.position : 0,
    slides: slenosafe.info ? slenosafe.info.titles : [],
    playing: slenosafe.playing,
    interval: slenosafe.interval,
  };
}

const server = new WebSocketServer(
  Number(Deno.env.get("DENO_APP_WEBSOCKET_PORT")!),
);

const emitter = new EventEmitter<{
  updateFiles(): void;
  updateSleno(): void;
}>();

updateFiles();

server.on("connection", function (client: WebSocketClient) {
  // Update the system variables and send it to the client
  const data = generateSystem();
  const json = JSON.stringify(data);

  client.send(json);

  emitter.on("updateFiles", () => {
    if (!client.isClosed) {
      // Re-read the powerpoint directory
      updateFiles();

      // Update the system variables and send it to the client
      const data = generateSystem();
      const json = JSON.stringify(data);
      client.send(json);
    }
  });

  emitter.on("updateSleno", () => {
    if (!client.isClosed) {
      // Update the system variables and send it to the client
      const data = generateSystem();
      const json = JSON.stringify(data);
      client.send(json);
    }
  });
});

export { emitter };
