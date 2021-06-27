import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";

export default interface InterfaceMapper {
  mapObject(row: any): Promise<BaseEntity> | BaseEntity;
  mapArray(rows: Array<any>): Promise<Array<BaseEntity>> | Array<BaseEntity>;
  mapCollection(
    rows: Array<any>,
    offset: number,
    limit: number,
    total: number,
  ): Promise<BaseCollection> | BaseCollection;
}
