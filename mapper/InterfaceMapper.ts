// deno-lint-ignore-file no-explicit-any

import BaseEntity from "../entity/BaseEntity.ts";
import BaseCollection from "../collection/BaseCollection.ts";

export default interface InterfaceMapper {
  mapObject(row: Record<string, never>): Promise<BaseEntity> | BaseEntity;
  mapArray(rows: Record<string, never>[]): Promise<BaseEntity[]> | BaseEntity[];
  mapCollection(
    rows: Record<string, never>[],
    offset: number,
    limit: number,
    total: number,
  ): Promise<BaseCollection> | BaseCollection;
}
