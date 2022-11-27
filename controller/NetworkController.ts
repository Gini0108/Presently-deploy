import manager from "../manager.ts";

import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";

import NetworkEntity from "../entity/NetworkEntity.ts";
import NetworkCollection from "../collection/NetworkCollection.ts";

import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.1.0/controller/GeneralController.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.1.0/controller/InterfaceController.ts";

export default class NetworkController implements InterfaceController {
  private generalController: GeneralController;

  constructor(
    name: string,
  ) {
    this.generalController = new GeneralController(
      name,
      NetworkEntity,
      NetworkCollection,
      {
        key: "uuid",
        type: "uuidv4",
        value: "network",
      },
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
    { response, params, state }: {
      response: Response;
      params: { uuid: string };
      state: State;
    },
  ) {
    return this.generalController.getObject({ response, params, state });
  }

  async updateObject(
    { request, response, params, state }: {
      request: Request;
      response: Response;
      params: { uuid: string };
      state: State;
    },
  ) {
    const uuid = params.uuid;
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
      state,
      value,
    });

    if (typeof file !== "undefined") {
      manager.networkOpen(uuid, file);
    }

    if (typeof playing !== "undefined") {
      manager.networkState(uuid, playing);
    }

    if (typeof spacing !== "undefined") {
      manager.networkSpacing(uuid, spacing);
    }
  }

  removeObject(
    { response, params, state }: {
      response: Response;
      params: { uuid: string };
      state: State;
    },
  ) {
    return this.generalController.removeObject({ response, params, state });
  }

  async addObject(
    { request, response, state }: {
      request: Request;
      response: Response;
      state: State;
    },
  ) {
    await this.generalController.addObject({ request, response, state });
  }
}
