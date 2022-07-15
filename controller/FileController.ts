import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";

import FileEntity from "../entity/FileEntity.ts";
import FileCollection from "../collection/FileCollection.ts";

import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/GeneralController.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

export default class FileController implements InterfaceController {
  private generalController: GeneralController;

  constructor(
    name: string,
  ) {
    this.generalController = new GeneralController(
      name,
      FileEntity,
      FileCollection,
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

  removeObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ) {
    return this.generalController.removeObject({ response, params });
  }

  addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    return this.generalController.addObject({ request, response });
  }
}
