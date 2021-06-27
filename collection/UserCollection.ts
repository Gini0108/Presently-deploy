import UserEntity from "../entity/UserEntity.ts";
import BaseCollection from "./BaseCollection.ts";

export default class UserCollection extends BaseCollection {
  public users: Array<UserEntity> = [];
}
