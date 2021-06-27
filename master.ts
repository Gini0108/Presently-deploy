import { initializeEnv } from "./helper.ts";
import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.1/mod.ts";
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.2/mod.ts";

// Initialize .env variables and make sure they are set
initializeEnv([
  "PRESENTLY_SERVER_PORT_SOCKET",
  "PRESENTLY_SERVER_SLAVE_ADDRESS",
]);

// Fetch the variables and convert them to right datatype
const port = +Deno.env.get("PRESENTLY_SERVER_PORT_SOCKET")!;
const slave = Deno.env.get("PRESENTLY_SERVER_SLAVE_ADDRESS")!;

export default class Master {
  public notes: Array<string> = [];
  public files: Array<string> = [];
  public slides: Array<string> = [];

  public current: string | null = null;
  public position: number | null = null;

  public interval = 30;
  public playing = false;
  public emitter = new EventEmitter<{
    update_clients(): void;
  }>();

  private server?: WebSocketServer;
  private clients: Array<WebSocketClient> = [];

  constructor() {
    // Start the WebSocket and add listeners
    this.server = new WebSocketServer(port);
    this.server.on("connection", this.clientConnect.bind(this));
    this.emitter.on("update_clients", this.clientUpdate.bind(this));
  }

  async initialize() {
    try {
      const response = await fetch(`http://${slave}`);
      const parsed = await response.json();

      this.notes = parsed.notes;
      this.files = parsed.files;
      this.slides = parsed.slides;

      this.playing = parsed.playing;
      this.current = parsed.current;
      this.position = parsed.position;
      this.interval = parsed.interval;
    } catch {
      setTimeout(this.initialize.bind(this), 5000);
      console.log(`Attempting ${slave} initialization again in 5 second`);
    }
  }

  async propagate(body: string) {
    const method = "POST";
    const response = await fetch(`http://${slave}`, { method, body });
    const parsed = await response.json();

    this.notes = parsed.notes;
    this.files = parsed.files;
    this.slides = parsed.slides;

    this.playing = parsed.playing;
    this.current = parsed.current;
    this.position = parsed.position;
    this.interval = parsed.interval;

    this.clientUpdate();
  }

  private generateJSON() {
    return JSON.stringify({
      files: this.files,
      notes: this.notes,
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
