import { isPowerpoint } from "../helper.ts";
import { walk } from "https://deno.land/std@0.93.0/fs/mod.ts";
import { File } from "../types.ts";

async function getFiles(): Promise<Array<File>> {
  const files = [];

  for await (const entry of walk("./powerpoint/")) {
    // Filter out everything but .pptx files
    if (isPowerpoint(entry.name)) {

      // Transform the path into a File instance
      const stat = await Deno.stat(entry.path);
      const file = {
        name: entry.name,
        size: stat.size,
        modified: stat.mtime!,
        accessed: stat.atime!,
        creation: stat.birthtime!,
      };

      files.push(file);
    }
  }

  return files;
}

export { getFiles }