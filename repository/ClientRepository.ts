import { UUIDColumn } from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Columns.ts";
import {
  MissingResource,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/errors.ts";

import ClientEntity from "../entity/ClientEntity.ts";
import ClientCollection from "../collection/ClientCollection.ts";

import mysqlClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/services/mysqlClient.ts";
import GeneralMapper from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/mapper/GeneralMapper.ts";
import GeneralRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/GeneralRepository.ts";
import InterfaceRepository from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/repository/InterfaceRepository.ts";

export default class ClientRepository implements InterfaceRepository {
  private generalName: string;
  private generalMapper: GeneralMapper;
  private generalRepository: GeneralRepository;

  constructor(
    name: string,
  ) {
    this.generalName = name;
    this.generalMapper = new GeneralMapper(ClientEntity, ClientCollection);
    this.generalRepository = new GeneralRepository(
      name,
      ClientEntity,
      ClientCollection,
    );
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<ClientCollection> {
    return await this.generalRepository.getCollection(offset, limit) as ClientCollection;
  }

  public async removeObject(uuid: string): Promise<void> {
    return await this.generalRepository.removeObject(uuid);
  }

  public async addObject(object: ClientEntity): Promise<ClientEntity> {
    return await this.generalRepository.addObject(object) as ClientEntity;
  }

  public async updateObject(object: ClientEntity): Promise<ClientEntity> {
    return await this.generalRepository.updateObject(object) as ClientEntity;
  }

  public async getObject(uuid: UUIDColumn): Promise<ClientEntity> {
    return await this.generalRepository.getObject(uuid) as ClientEntity;
  }

  public async getObjectBySerial(
    serial: string,
  ): Promise<ClientEntity> {
    const query = "SELECT HEX(uuid) AS uuid, title, serial, heard, called, online, created, updated FROM client WHERE serial = ? ORDER BY created LIMIT 1";
    const data = await mysqlClient.execute(query, [serial]);

    if (typeof data.rows === "undefined" || data.rows.length === 0) {
      throw new MissingResource(this.generalName);
    }

    const row = data.rows![0];
    return this.generalMapper.mapObject(row) as ClientEntity;
  }
}
