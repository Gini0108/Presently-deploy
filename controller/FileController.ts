import { MissingImplementation } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";

import spacesClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/services/spacesClient.ts";
import convertClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/services/convertClient.ts";

import FileEntity from "../entity/FileEntity.ts";
import FileCollection from "../collection/FileCollection.ts";

import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/GeneralRepository.ts";
import GeneralController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/GeneralController.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

import { renderREST } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/helper.ts";

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
    const fileUuid = params.uuid;

    // const fileName = `${fileUuid}.pptx`;
    // const fileSigned = spacesClient.signedGET(fileName);

    const fileEntity = await this.generalRepository.getObject(
      fileUuid,
    ) as FileEntity;
    const fileStatus = fileEntity.status.getValue();
    const fileReference = fileEntity.reference.getValue();

    if (fileReference && fileStatus !== "finished" && fileStatus !== "error") {
      const convertStatus = await convertClient.convertPPTXStatus(
        fileReference,
      );

      fileEntity.status.setValue(convertStatus);

      this.generalRepository.updateObject(fileEntity);
    }

    response.body = renderREST(fileEntity);
  }

  async addObjectStatus(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ) {
    const fileUuid = params.uuid;
    const fileEntity = await this.generalRepository.getObject(
      fileUuid,
    ) as FileEntity;

    const fileName = `${fileEntity.uuid.getValue()}.pptx`;
    const fileStatus = fileEntity.status.getValue();

    if (fileStatus === "uploading") {
      const convertUuid = await convertClient.convertPPTX(fileName);
      const convertStatus = await convertClient.convertPPTXStatus(convertUuid);

      fileEntity.status.setValue(convertStatus);
      fileEntity.reference.setValue(convertUuid);

      this.generalRepository.updateObject(fileEntity);
    }

    response.body = renderREST(fileEntity);
  }

  async removeObject(
    { response, params }: {
      response: Response;
      params: { uuid: string };
    },
  ) {
    const entity = await this.generalController.getObject({
      response,
      params,
    });

    // Remove the file from S3 storage
    const filename = `${entity.uuid}.pptx`;
    const foldername = `${entity.uuid}`;

    await spacesClient.deleteFile(filename);
    await spacesClient.deleteFile(foldername);

    // Remove the file from the database
    return this.generalController.removeObject({ response, params });
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    const entity = await this.generalController.addObject({
      request,
      response,
    });

    const filename = `${entity.uuid}.pptx`;
    const upload = spacesClient.signedPUT(filename);

    response.body = { ...entity, upload };
  }
}
