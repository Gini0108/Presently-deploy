import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

import { isPowerpoint } from "../helper.ts";
import {
  BodyError,
  TypeError,
} from "../middleware/error.ts";

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

  if (playing) {
    if (typeof playing !== "boolean") throw new TypeError("boolean", "playing");

    // Update the playing
  }

  if (filename) {
    if (typeof filename !== "string") throw new TypeError("string", "filename");

    // Make sure the user is trying to add an .pptx file
    // if (!isPowerpoint(filename)) {
    //   throw new PropertyError("email", "filename");
    // }

    // Make sure the file exists
    // if (existsSync(`./powerpoint/${filename}`)) {
    //   throw new ResourceError("missing", "file");
    // }

    // Update the filename
  }

  if (interval) {
    if (typeof interval !== "number") throw new TypeError("number", "interval");

    // Update the interval
  }

  if (position) {
    if (typeof position !== "number") throw new TypeError("number", "position");

    // Update the position
  }

  // If the system has changed echo a websocket change

  response.status = 200;
};

export { updateSystem };
