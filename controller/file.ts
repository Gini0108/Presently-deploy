import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { Base64 } from "https://deno.land/x/bb64/mod.ts";
import { isPowerpoint } from "../helper.ts";
import { emitter } from "../websocket.ts";
import {
  BodyError,
  PropertyError,
  ResourceError,
  TypeError,
} from "../middleware/error.ts";

const addFile = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch the body object
  if (!request.hasBody) throw new BodyError("missing");
  const body = await request.body({ type: "json" });
  const value = await body.value.catch(() => {
    throw new BodyError("invalid");
  });

  const base64 = value.base64;
  const filename = value.filename;

  if (typeof base64 !== "string") throw new TypeError("string", "base64");
  if (typeof filename !== "string") throw new TypeError("string", "filename");

  // Make sure all required values are provided
  if (!base64) throw new PropertyError("missing", "base64");
  if (!filename) throw new PropertyError("missing", "filename");

  // Make sure the user is trying to add an .pptx file
  if (!isPowerpoint(filename)) {
    throw new PropertyError("extension", "filename");
  }

  // Make sure the file doesn't already exist
  if (existsSync(`./powerpoint/${filename}`)) {
    throw new ResourceError("duplicate", "file");
  }

  // Write the file to storage
  Base64.fromBase64String(base64).toFile(`./powerpoint/${filename}`);

  // Propagate the event to the websocket
  emitter.emit("updateFiles");

  response.status = 200;
};

const deleteFile = (
  { params, response }: { params: { filename: string }; response: Response },
) => {
  const filename = params.filename;

  // Make sure the user is trying to delete an .pptx file
  if (!isPowerpoint(filename)) {
    throw new PropertyError("extension", "filename");
  }

  // Make sure the file exists
  if (!existsSync(`./powerpoint/${filename}`)) {
    throw new ResourceError("missing", "file");
  }

  // Delete the file from storage
  Deno.removeSync(`./powerpoint/${filename}`);

  // Propagate the event to the websocket
  emitter.emit("updateFiles");

  response.status = 200;
};

export { addFile, deleteFile };
