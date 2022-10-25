import manager from "../manager.ts";

import { Request, Response } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";

import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

export default class SystemController implements InterfaceController {
  getCollection() {
    throw new MissingImplementation();
  }

  getObject() {
    throw new MissingImplementation();
  }

  updateObject() {
    throw new MissingImplementation();
  }

  removeObject() {
    throw new MissingImplementation();
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    const body = await request.body();
    const value = await body.value;

    const {
      file,
      playing,
      interval,
    } = value;

    if (typeof file !== "undefined") {
      manager.systemOpen(file);
    }

    if (typeof playing !== "undefined") {
      manager.systemState(playing);
    }

    if (typeof interval !== "undefined") {
      manager.systemInterval(interval);
    }

    response.body = value;
  }
}
