import sleno from "../sleno.ts";

import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { BodyError, PropertyError, TypeError } from "../errors.ts";

const addFile = async (
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
    base64,
    filename,
  } = value;

  // Make sure all required properties are provided
  if (typeof base64 === "undefined") {
    throw new PropertyError("missing", "base64");
  }
  if (typeof filename === "undefined") {
    throw new PropertyError("missing", "filename");
  }

  // Make sure all required properties are right type
  if (typeof base64 !== "string") throw new TypeError("string", "base64");
  if (typeof filename !== "string") throw new TypeError("string", "filename");

  await sleno.createFile(filename, base64);

  // Progegate WebSocket update to all clients
  await sleno.emitter.emit("update_clients");
  response.status = 200;
};

const deleteFile = async (
  { params, response }: { params: { filename: string }; response: Response },
) => {
  // Fetch the filename from the URL
  const filename = params.filename;

  // Let Sleno handle the file deletion
  await sleno.removeFile(filename);

  // Progegate WebSocket update to all clients
  await sleno.emitter.emit("update_clients");
  response.status = 200;
};

export { addFile, deleteFile };
