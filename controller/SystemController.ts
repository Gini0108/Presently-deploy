import { Request, Response } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import manager from "../manager.ts";
import spacesClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/services/spacesClient.ts";
import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";
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
      goto,
    } = value;

    if (file) {
      manager.systemOpen(file);
    }

    if (goto) {
      manager.systemGoto(goto);
    }

    response.body = value;
  }
}
