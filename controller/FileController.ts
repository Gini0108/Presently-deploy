import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/errors.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";

import spacesClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/services/spacesClient.ts";
import convertClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/services/convertClient.ts";

import FileEntity from "../entity/FileEntity.ts";
import FileCollection from "../collection/FileCollection.ts";

import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/repository/GeneralRepository.ts";
import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/controller/GeneralController.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/controller/InterfaceController.ts";

import { renderREST } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/helper.ts";

export default class FileController implements InterfaceController {
  private generalRepository: GeneralRepository;
  private generalController: GeneralController;

  constructor(
    name: string,
  ) {
    this.generalRepository = new GeneralRepository(
      name,
      FileEntity,
      FileCollection,
    );

    this.generalController = new GeneralController(
      name,
      FileEntity,
      FileCollection,
      {
        key: "network",
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

  updateObject() {
    throw new MissingImplementation();
  }

  async getObject(
    { response, params, state }: {
      response: Response;
      params: { uuid: string };
      state: State;
    },
  ) {
    const fileUuid = params.uuid;
    const fileEntity = await this.generalRepository.getObject(
      fileUuid,
      {
        key: "network",
        type: "uuidv4",
        value: state.network,
      },
    ) as FileEntity;

    const fileStatus = fileEntity.status.getValue();
    const fileReference = fileEntity.reference.getValue();

    if (fileReference && fileStatus !== "finished" && fileStatus !== "error") {
      const convertStatus = await convertClient.convertPPTXStatus(
        fileReference,
      );

      fileEntity.status.setValue(convertStatus);

      this.generalRepository.updateObject(
        fileEntity,
        {
          key: "network",
          type: "uuidv4",
          value: state.network,
        },
      );
    }

    response.body = renderREST(fileEntity);
  }

  async addObjectStatus(
    { response, params, state }: {
      response: Response;
      params: { uuid: string };
      state: State;
    },
  ) {
    const fileUuid = params.uuid;
    const fileEntity = await this.generalRepository.getObject(
      fileUuid,
      {
        key: "network",
        type: "uuidv4",
        value: state.network,
      },
    ) as FileEntity;

    const fileStatus = fileEntity.status.getValue();

    if (fileStatus === "uploading") {
      const convertUuid = await convertClient.convertPPTX(fileUuid);
      const convertStatus = await convertClient.convertPPTXStatus(convertUuid);

      fileEntity.status.setValue(convertStatus);
      fileEntity.reference.setValue(convertUuid);

      this.generalRepository.updateObject(
        fileEntity,
        {
          key: "network",
          type: "uuidv4",
          value: state.network,
        },
      );
    }

    response.body = renderREST(fileEntity);
  }

  async removeObject(
    { response, params, state }: {
      response: Response;
      params: { uuid: string };
      state: State;
    },
  ) {
    const entity = await this.generalController.getObject({
      response,
      params,
      state,
    });

    // Remove the file from S3 storage
    const filename = `${entity.uuid}.pptx`;
    const foldername = `${entity.uuid}`;

    await spacesClient.deleteFile(filename);
    await spacesClient.deleteFile(foldername);

    // Remove the file from the database
    return this.generalController.removeObject({ response, params, state });
  }

  async addObject(
    { request, response, state }: {
      request: Request;
      response: Response;
      state: State;
    },
  ) {
    const entity = await this.generalController.addObject({
      request,
      response,
      state,
    });

    const filename = `${entity.uuid}.pptx`;
    const upload = spacesClient.signedPUT(filename);

    response.body = { ...entity, upload };
  }
}
