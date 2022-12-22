import UserEntity from "../entity/UserEntity.ts";
import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.2.1/collection/BaseCollection.ts";

export default class UserCollection extends BaseCollection {
  public files: UserEntity[] = [];
}
