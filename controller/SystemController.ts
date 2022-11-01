import manager from "../manager.ts";

import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";

import SystemEntity from "../entity/SystemEntity.ts";
import SystemCollection from "../collection/SystemCollection.ts";

import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/GeneralController.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

export default class SystemController implements InterfaceController {
  private generalController: GeneralController;

  constructor(
    name: string,
  ) {
    this.generalController = new GeneralController(
      name,
      SystemEntity,
      SystemCollection,
    );
  }

  getCollection(
    { response, state }: {
      response: Response;
      state: State;
    },
  ) {
    return this.generalController.getCollection({ response, state });
  }

  getObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ) {
    return this.generalController.getObject({ response, params });
  }

  async updateObject(
    { request, response, params }: {
      request: Request;
      response: Response;
      params: { uuid: string };
    },
  ) {
    const body = await request.body();
    const value = await body.value;
    const {
      file,
      playing,
      spacing,
    } = value;

    await this.generalController.updateObject({
      request,
      response,
      params,
      value,
    });

    if (typeof file !== "undefined") {
      manager.systemOpen(file);
    }

    if (typeof playing !== "undefined") {
      manager.systemState(playing);
    }

    if (typeof spacing !== "undefined") {
      manager.systemInterval(spacing);
    }
  }

  removeObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ) {
    return this.generalController.removeObject({ response, params });
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    await this.generalController.addObject({ request, response });
  }
}
