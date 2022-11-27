import FileEntity from "../entity/FileEntity.ts";
import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/v1.1.0/collection/BaseCollection.ts";

export default class FileCollection extends BaseCollection {
  public files: FileEntity[] = [];
}
