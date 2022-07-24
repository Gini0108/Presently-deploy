import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";

import spacesClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/services/spacesClient.ts";
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

  updateObject() {
    throw new MissingImplementation();
  }

  async getObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ) {
    const entity = await this.generalController.getObject({
      response,
      params,
    });

    const filename = `${entity.uuid}.${entity.type}`;
    const download = spacesClient.signedGET(filename);

    response.body = { ...entity, download };
  }

  removeObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ) {
    // TODO: Remove file from S3 storage

    return this.generalController.removeObject({ response, params });
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    const entity = await this.generalController.addObject({
      request,
      response,
    });

    const filename = `${entity.uuid}.${entity.type}`;
    const upload = spacesClient.signedPUT(filename);

    response.body = { ...entity, upload };
  }
}
