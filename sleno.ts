import { Base64 } from "https://deno.land/x/bb64@1.1.0/mod.ts";
import { walkSync } from "https://deno.land/std@0.96.0/fs/mod.ts";
import { existsSync } from "https://deno.land/std@0.98.0/fs/mod.ts";
import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.1/mod.ts";

import { Info, Stat } from "./types.ts";
import { isPowerpoint, isTemporary } from "./helper.ts";
import { PropertyError, ResourceError } from "./errors.ts";
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.2/mod.ts";

class Sleno {
  public files: Array<string> = [];
  public slides: Array<string> = [];

  public current: string | null = null;
  public position: number | null = null;

  public interval = 30;
  public playing = false;
  public emitter = new EventEmitter<{
    update_clients(): void;
  }>();

  private timer?: number;
  private server?: WebSocketServer;
  private clients: Array<WebSocketClient> = [];

  async initializeSleno() {
    // Start PowerPoint if it isn't running
    const path = Deno.env.get("DENO_APP_POWERPOINT_LOCATION")!;
    const port = Number(Deno.env.get("DENO_APP_WEBSOCKET_PORT")!);

    // Read the powerpoint files into an array
    this.files = this.readFiles();

    // Start the WebSocket and add listeners
    this.server = new WebSocketServer(port);
    this.server.on("connection", this.clientConnect.bind(this));
    this.emitter.on("update_clients", this.clientUpdate.bind(this));

    await Deno.run({
      cmd: [
        "powershell.exe",
        `if (! (ps | ? {$_.path -eq "${path}"})) { & "${path}"}`,
      ],
    });
  }

  async removeFile(filename: string) {
    const folder = Deno.env.get("DENO_APP_POWERPOINT_FOLDER")!
    const encoded = filename.replace(/ /g, "%20");

    // Make sure the file exists
    if (!existsSync(`${folder}\\${encoded}`)) {
      throw new ResourceError("missing", "file");
    }

    // Unload the file from Sleno
    await this.unloadFile(filename);

    // Delete the file from storage
    Deno.removeSync(`${folder}\\${encoded}`);

    // Update the files array
    this.files = this.readFiles();
  }

  async createFile(filename: string, base64: string) {
    const folder = Deno.env.get("DENO_APP_POWERPOINT_FOLDER")!
    const encoded = filename.replace(/ /g, "%20");

    // Make sure the file doesn't already exist
    if (existsSync(`${folder}\\${encoded}`)) {
      throw new ResourceError("duplicate", "file");
    }

    // Write the file to storage
    await Base64.fromBase64String(base64).toFile(`${folder}\\${encoded}`);

    // Update the files array
    this.files = this.readFiles();
  }

  async unloadFile(filename: string | null) {
    // Only unload the file if there is a Powerpoint playing
    if (this.current && this.current === filename) {
      await this.request(`CLOSE`);

      this.slides = [];
      this.current = null;
      this.position = null;
    }
  }

  async loadFile(filename: string) {
    const folder = Deno.env.get("DENO_APP_POWERPOINT_FOLDER")!
    const decoded = filename.replace(/ /g, "%20");

    // Make sure the user is trying to add an .pptx file
    if (!isPowerpoint(decoded)) {
      throw new PropertyError("extension", "filename");
    }

    // Make sure the file exist
    if (!existsSync(`${folder}\\${decoded}`)) {
      throw new ResourceError("missing", "file");
    }

    // Stop the presentation interval and close the current file
    await this.setPlaying(false);
    await this.unloadFile(this.current);

    // Open and start the new presentation
    await this.request(`OPEN ${folder}\\${decoded}`);
    await this.request(`START`);

    const info = await (this.request(`INFO`) as Promise<Info>);

    this.slides = info.titles;
    this.current = filename;
    this.position = 0;
  }

  async setPosition(position: number) {
    if (this.current) {
      const stats = await (this.request(`STAT`) as Promise<Stat>);
      const slides = stats!.slides;
      const remainder = position % slides;

      this.position = remainder >= 0 ? remainder : slides + remainder;

      await this.request(`GOTO ${this.position + 1}`);
    }
  }

  setInterval(interval: number) {
    this.interval = interval;

    if (this.playing) {
      // Clear the previous interval and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(
        this.nextIndex.bind(this),
        this.interval * 1000,
      );
    }
  }

  setPlaying(playing: boolean) {
    // Make sure a PowerPoint has been loaded
    if (this.current) {
      if (playing && !this.playing) {
        // Start a timer with the new interval
        this.timer = setInterval(
          this.nextIndex.bind(this),
          this.interval * 1000,
        );
      } else if (!playing && this.playing) {
        // Stop the previous timer
        clearInterval(this.timer);
      }

      this.playing = playing;
    }
  }

  private async request<T>(command: string): Promise<T | void> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Start the connector script
    const process = Deno.run({
      cmd: ["scripts/connector-win-ppt2010.bat"],
      stdin: "piped",
      stdout: "piped",
    });

    // Write the command to the script process
    await process.stdin.write(encoder.encode(`${command}\n`));
    await process.stdin.close();

    // Parse the output back into an object
    const buffer = await process.output();
    const parsed = decoder.decode(buffer);
    const object = JSON.parse(parsed);

    // Close the process after fetching the output
    process.close();

    // Return the error message if it exists
    return new Promise(function (resolve, reject) {
      if (object.error) {
        reject(object.error);
      }

      if (object.response === "OK") {
        resolve();
      }

      // Only return the response if it's not an error message nor an "OK" message
      resolve(object.response);
    });
  }

  private async nextIndex() {
    // Fetch the latest application position
    const stats = await (this.request(`STAT`) as Promise<Stat>);

    if (stats!.position < stats!.slides) {
      await this.setPosition(stats!.position);
    } else {
      await this.setPosition(0);
    }

    this.clientUpdate();
  }

  private readFiles() {
    const files: Array<string> = [];
    const folder = Deno.env.get("DENO_APP_POWERPOINT_FOLDER")!

    for (const entry of walkSync(folder)) {
      if (
        entry.isFile && isPowerpoint(entry.name) && !isTemporary(entry.name)
      ) {
        // Since we store the files URI encoded parse it back
        const name = entry.name.replace(/%20/g, " ");
        files.push(name);
      }
    }

    return files;
  }

  private generateJSON() {
    return JSON.stringify({
      files: this.files,
      slides: this.slides,
      playing: this.playing,
      current: this.current,
      position: this.position,
      interval: this.interval,
    });
  }

  private clientUpdate() {
    this.clients.forEach((client: WebSocketClient) => {
      if (!client.isClosed) {
        client.send(this.generateJSON());
      }
    });
  }

  private clientConnect(client: WebSocketClient) {
    if (!client.isClosed) {
      this.clients.push(client);
      client.send(this.generateJSON());
    }
  }
}

export default new Sleno();
