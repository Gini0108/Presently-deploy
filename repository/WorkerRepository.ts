import { UUIDColumn } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";
import {
  MissingResource,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";

import WorkerEntity from "../entity/WorkerEntity.ts";
import WorkerCollection from "../collection/WorkerCollection.ts";

import mysqlClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/services/mysqlClient.ts";
import GeneralMapper from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/mapper/GeneralMapper.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/GeneralRepository.ts";
import InterfaceRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/InterfaceRepository.ts";

export default class WorkerRepository implements InterfaceRepository {
  private generalName: string;
  private generalMapper: GeneralMapper;
  private generalRepository: GeneralRepository;

  constructor(
    name: string,
  ) {
    this.generalName = name;
    this.generalMapper = new GeneralMapper(WorkerEntity, WorkerCollection);
    this.generalRepository = new GeneralRepository(
      name,
      WorkerEntity,
      WorkerCollection,
    );
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<WorkerCollection> {
    return await this.generalRepository.getCollection(
      offset,
      limit,
    ) as WorkerCollection;
  }

  public async removeObject(uuid: string): Promise<void> {
    return await this.generalRepository.removeObject(uuid);
  }

  public async addObject(object: WorkerEntity): Promise<WorkerEntity> {
    return await this.generalRepository.addObject(object) as WorkerEntity;
  }

  public async updateObject(object: WorkerEntity): Promise<WorkerEntity> {
    return await this.generalRepository.updateObject(object) as WorkerEntity;
  }

  public async getObject(uuid: UUIDColumn): Promise<WorkerEntity> {
    return await this.generalRepository.getObject(uuid) as WorkerEntity;
  }

  public async getObjectBySerial(
    serial: string,
  ): Promise<WorkerEntity> {
    const query =
      "SELECT HEX(uuid) AS uuid, title, serial, online, created, updated FROM worker WHERE serial = ? ORDER BY created LIMIT 1";
    const data = await mysqlClient.execute(query, [serial]);

    if (typeof data.rows === "undefined" || data.rows.length === 0) {
      throw new MissingResource(this.generalName);
    }

    const row = data.rows![0];
    return this.generalMapper.mapObject(row) as WorkerEntity;
  }
}
