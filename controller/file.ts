import slenosafe from "../slenosafe.ts";

import { Request, Response } from "https://deno.land/x/oak@v7.3.0/mod.ts";

import { BodyError, PropertyError, TypeError } from "../middleware/error.ts";

const addFile = async (
  { request, response }: { request: Request; response: Response },
) => {
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

  await slenosafe.createFile(filename, base64);
  await slenosafe.events.emit("update_clients");

  response.status = 200;
};

const deleteFile = async (
  { params, response }: { params: { filename: string }; response: Response },
) => {
  const filename = params.filename;

  await slenosafe.removeFile(filename);
  await slenosafe.events.emit("update_clients");

  response.status = 200;
};

export { addFile, deleteFile };
