import size from 'get-folder-size';
import Slideshow from 'slideshow';

export function executeInterval(slider: Slideshow): Promise<void> {
  return new Promise(async (resolve) => {
    // Fetch the slideshow statistics
    const statistics = await slider.stat();

    // Execute the actual movement logic
    if (statistics.position >= 0 && statistics.slides >= 0) {
      if (statistics.position + 1 > statistics.slides) {
        await slider.goto(1);
      } else {
        await slider.next();
      }
    }

    // Once done resolve the promise
    resolve();
  });
}

export function folderSize(folder: string) {
  return new Promise(async (resolve, reject) => {
    // The folder size library only returns a callback so we wrapped it in a promise
    size(`./${process.env.ROMEO_FOLDER}`, (error, filesize) => {
      // If a error occurs reject the promise
      if (error) reject(error);

      // Once done resolve the promise
      const megabyteSize = filesize / 1048576;
      const megabyteRounded = Math.ceil(megabyteSize);

      resolve(megabyteRounded);
    });
  });
}
