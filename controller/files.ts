import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";

const addFile = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;

  const filename = value.filename;
  const extension = filename.split('.').pop();

  // Make sure all required values are provided
  if (!value.base64) {
    response.body = `Missing 'base64' property`;
    response.status = 400;
    return;
  }

  if (!value.filename) {
    response.body = `Missing 'filename' property`;
    response.status = 400;
    return;
  }

  // Make sure the user is trying to add an .pptx file
  if (extension !== "pptx") {
    response.body = `This file has an invalid extension`;
    response.status = 400;
    return;
  }

  // Make sure the file doesn't exist
  if (!existsSync(`./powerpoint/${filename}`)) {
    response.body = `This file already exists`
    response.status = 409;
    return;
  }

  // Add the file to storage
  const array = base64.toUint8Array(value.base64);
  await Deno.writeFile(`./powerpoint/${filename}`, array);

  response.status = 200;
};

const deleteFile = (
  { params, response }: { params: { filename: string }; response: Response },
) => {
  const filename = params.filename;
  const extension = filename.split('.').pop();

  // Make sure the user is trying to delete an .pptx file
  if (extension !== "pptx") {
    response.body = `This file has an invalid extension`;
    response.status = 403;
    return;
  }

  // Make sure the file exists
  if (!existsSync(`./powerpoint/${filename}`)) {
    response.body = `This file does not exists`
    response.status = 404;
    return;
  }

  // Delete the file from storage
  Deno.removeSync(`./powerpoint/${filename}`);

  response.status = 200;
};

  

export { getFiles };