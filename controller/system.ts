import slenosafe from "../slenosafe.ts";

import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";

import { BodyError, TypeError } from "../middleware/error.ts";

const updateSystem = async (
  { request, response }: { request: Request; response: Response },
) => {
  if (!request.hasBody) throw new BodyError("missing");

  const body = await request.body({ type: "json" });
  const value = await body.value.catch(() => {
    throw new BodyError("invalid");
  });

  const playing = value.playing;
  const position = value.position;
  const filename = value.filename;
  const interval = value.interval;

  // The setInterval and setPlaying functions can't return an error
  if (typeof playing !== "undefined") {
    if (typeof playing !== "boolean") throw new TypeError("boolean", "playing");
    await slenosafe.setPlaying(playing);
  }

  if (typeof interval !== "undefined") {
    if (typeof interval !== "number") throw new TypeError("number", "interval");
    await slenosafe.setInterval(interval);
  }

  if (typeof filename !== "undefined") {
    if (typeof filename !== "string") throw new TypeError("string", "filename");
    await slenosafe.loadFile(filename);
  }

  if (typeof position !== "undefined") {
    if (typeof position !== "number") throw new TypeError("number", "index");
    await slenosafe.setPosition(position);
  }

  response.status = 200;
};

export { updateSystem };
