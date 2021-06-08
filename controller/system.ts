import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import slenosafe from "../slenosafe.ts";
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
  const index = value.index;

  // The setInterval and setPlaying functions can't return an error
  if (typeof playing !== "undefined") {
    if (typeof playing !== "boolean") throw new TypeError("boolean", "playing");
    slenosafe.setPlaying(playing);
  }

  if (typeof interval !== "undefined") {
    if (typeof interval !== "number") throw new TypeError("number", "interval");
    slenosafe.setInterval(interval);
  }

  if (typeof filename !== "undefined") {
    if (typeof filename !== "string") throw new TypeError("string", "filename");

    // If Sleno throws an error send it back to the
    await slenosafe.loadFile(filename).catch((error) => {
      response.body = error;
      response.status = 400;
    });
  }

  if (typeof index !== "undefined") {
    if (typeof index !== "number") throw new TypeError("number", "index");

    // If Sleno throws an error send it back to the user
    slenosafe.setPosition(index).catch((error) => {
      response.body = error;
      response.status = 400;
    });
  }

  response.status = 200;
};

export { updateSystem };
