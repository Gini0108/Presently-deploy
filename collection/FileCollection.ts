import FileEntity from "../entity/FileEntity.ts";
import BaseCollection from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/collection/BaseCollection.ts";

export default class FileCollection extends BaseCollection {
  public files: FileEntity[] = [];
}
