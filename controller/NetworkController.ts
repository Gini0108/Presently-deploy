import manager from "../manager.ts";

import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";

import NetworkEntity from "../entity/NetworkEntity.ts";
import NetworkCollection from "../collection/NetworkCollection.ts";

import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/controller/GeneralController.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.0.0/controller/InterfaceController.ts";

export default class NetworkController implements InterfaceController {
  private generalController: GeneralController;

  constructor(
    name: string,
  ) {
    this.generalController = new GeneralController(
      name,
      NetworkEntity,
      NetworkCollection,
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
      manager.networkOpen(file);
    }

    if (typeof playing !== "undefined") {
      manager.networkState(playing);
    }

    if (typeof spacing !== "undefined") {
      manager.networkSpacing(spacing);
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
