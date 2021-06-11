import { Base64 } from "https://deno.land/x/bb64/mod.ts";
import { walkSync } from "https://deno.land/std@0.96.0/fs/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.2/mod.ts";

import Sleno from "../Sleno/index.ts";

import { PropertyError, ResourceError } from "./middleware/error.ts";
import {
  isTemporary,
  isPowerpoint,
  initializeEnv
 } from "./helper.ts";

// Load. env file
initializeEnv([
  "DENO_APP_WEBSOCKET_PORT",
  "DENO_APP_POWERPOINT_LOCATION",
]);

class Slenosafe {
  private sleno = new Sleno("PowerPoint");

  public files: Array<string> = [];
  public slides: Array<string> = [];

  public current: string | null = null;
  public position: number | null = null;

  public playing = false;
  public interval = 30;

  private timer?: number;
  private server?: WebSocketServer;

  private clients: Array<WebSocketClient> = [];

  async initializeSleno() {
    // Fetch the Powerpoint .exe path
    const path = Deno.env.get("DENO_APP_POWERPOINT_LOCATION")!;

    // Start PowerPoint if it isn't running
    await Deno.run({
      cmd: [
        "powershell.exe",
        `if (! (ps | ? {$_.path -eq "${path}"})) { & "${path}"}`,
      ],
    });

    // Start the websocket server
    this.server = new WebSocketServer(
      Number(Deno.env.get("DENO_APP_WEBSOCKET_PORT")!),
    );

    this.server.on("connection", this.clientConnect.bind(this));
    this.readFiles();

    // Start Sleno
    await this.sleno.boot();
  }

  async removeFile(filename: string) {
    // Make sure the file exists
    if (!existsSync(`./powerpoint/${filename}`)) {
      throw new ResourceError("missing", "file");
    }

    // Unload the file from Sleno
    await this.unloadFile(filename);

    // Delete the file from storage
    Deno.removeSync(`./powerpoint/${filename}`);

    // Update the files array
    this.files = this.readFiles();
    this.clientUpdate();
  }

  async createFile(filename: string, base64: string) {
    // Make sure the file doesn't already exist
    if (existsSync(`./powerpoint/${filename}`)) {
      throw new ResourceError("duplicate", "file");
    }

    // Write the file to storage
    await Base64.fromBase64String(base64).toFile(`./powerpoint/${filename}`);

    // Update the files array
    this.files = this.readFiles();
    this.clientUpdate();
  }

  async unloadFile(filename: string | null) {
    if (this.current && this.current === filename) {
      await this.sleno.close();

      this.slides = [];
      this.current = null;
      this.position = null;

      this.clientUpdate();
    }
  }

  async loadFile(filename: string) {
    // Make sure the user is trying to add an .pptx file
    if (!isPowerpoint(filename)) {
      throw new PropertyError("extension", "filename");
    }

    // Make sure the file exist
    if (!existsSync(`./powerpoint/${filename}`)) {
      throw new ResourceError("missing", "file");
    }

    // Stop the presentation interval and close the current file
    await this.setPlaying(false);
    await this.unloadFile(this.current);

    // Open and start the new presentation
    await this.sleno.open(`powerpoint/${filename}`);
    await this.sleno.start();

    const info = await this.sleno.info();

    this.slides = info.titles;
    this.current = filename;
    this.position = 0;

    this.clientUpdate();
  }

  async setPosition(position: number) {
    if (this.current) {
      const stats = await this.sleno.stat();
      const slides = stats!.slides;
      const remainder = position % slides;

      this.position = remainder >= 0 ? remainder : slides + remainder;

      await this.sleno.goto(this.position + 1);

      this.clientUpdate();
    }

    // TODO: throw error if no presentation is loaded
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

    this.clientUpdate();

    // TODO: refactor interval logic to timeout to account for delay in moving to the next slide
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
      this.clientUpdate();
    }
  }

  private async nextIndex() {
    // Fetch the latest application position
    const stats = await this.sleno.stat();

    if (stats!.position < stats!.slides) {
      await this.setPosition(stats!.position);
    } else {
      await this.setPosition(0);
    }

    this.clientUpdate();
  }

  private readFiles() {
    const files: Array<string> = [];

    for (const entry of walkSync("./powerpoint")) {
      if (
        entry.isFile && isPowerpoint(entry.name) && !isTemporary(entry.name)
      ) {
        this.files.push(entry.name);
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

export default new Slenosafe();
