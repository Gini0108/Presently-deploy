import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

import slenosafe from "../slenosafe.ts";
import { isPowerpoint } from "../helper.ts";
import { BodyError, TypeError } from "../middleware/error.ts";

const updateSystem = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch the body object
  if (!request.hasBody) throw new BodyError("missing");
  const body = await request.body({ type: "json" });
  const value = await body.value.catch(() => {
    throw new BodyError("invalid");
  });

  const playing = value.playing;
  const filename = value.filename;
  const interval = value.interval;
  const position = value.position;

  // The setInterval and setPlaying functions can't return an error 
  if (playing) {
    if (typeof playing !== "boolean") throw new TypeError("boolean", "playing");
    slenosafe.setPlaying(playing);
  }

  if (interval) {
    if (typeof interval !== "number") throw new TypeError("number", "interval");
    slenosafe.setInterval(interval);
  }

  if (filename) {
    if (typeof filename !== "string") throw new TypeError("string", "filename");

    // If Sleno throws an error send it back to the user
    await slenosafe.loadFile(filename).catch((error) => {
      response.body = error;
      response.status = 400;
    });
  }

  if (position) {
    if (typeof position !== "number") throw new TypeError("number", "position");

    // If Sleno throws an error send it back to the user
    slenosafe.setPosition(position).catch((error) => {
      response.body = error;
      response.status = 400;
    });
  }

  // If the system has changed echo a websocket change

  response.status = 200;
};

export { updateSystem };
