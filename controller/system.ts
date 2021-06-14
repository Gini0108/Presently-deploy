import sleno from "../sleno.ts";

import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { BodyError, TypeError } from "../errors.ts";

const updateSystem = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Make sure a body is provided
  if (!request.hasBody) throw new BodyError("missing");

  // Make sure the body is valid JSON
  const body = await request.body({ type: "json" });
  const value = await body.value.catch(() => {
    throw new BodyError("invalid");
  });

  // Transfer properties to constants
  const {
    playing,
    position,
    filename,
    interval,
  } = value;

  if (typeof playing !== "undefined") {
    if (typeof playing !== "boolean") throw new TypeError("boolean", "playing");
    await sleno.setPlaying(playing);
  }

  if (typeof interval !== "undefined") {
    if (typeof interval !== "number") throw new TypeError("number", "interval");
    await sleno.setInterval(interval);
  }

  if (typeof filename !== "undefined") {
    if (typeof filename !== "string") throw new TypeError("string", "filename");
    await sleno.loadFile(filename);
  }

  if (typeof position !== "undefined") {
    if (typeof position !== "number") throw new TypeError("number", "index");
    await sleno.setPosition(position);
  }

  // Progegate WebSocket update to all clients
  await sleno.emitter.emit("update_clients");
  response.status = 200;
};

export { updateSystem };
