import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";

export default interface InterfaceRepository {
  getCollection(offset: number, limit: number): Promise<BaseCollection>;
  removeObject(uuid: string): Promise<boolean>;
  addObject(object: BaseEntity): Promise<BaseEntity>;
  getObject(uuid: string): Promise<BaseEntity | null>;
}
