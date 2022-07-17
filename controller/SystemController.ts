import manager from "../manager.ts";

import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";
import { Request, Response } from "https://deno.land/x/oak@v10.6.0/mod.ts";

import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

export default class SystemController implements InterfaceController {
  getCollection() {
    throw new MissingImplementation();
  }

  getObject() {
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

    if (file) {
      manager.systemOpen(file);
    }

    if (playing) {
      manager.systemState(playing);
    }

    if (interval) {
      manager.systemInterval(interval);
    }

    response.body = value;
  }
}
