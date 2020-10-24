'use strict';

// Import required packages
import formidable from 'formidable';
import express from 'express';
import size from 'get-folder-size';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Get all the PowerPoints from the temporary folder
router.get('/', (request, response) => {
  // If the folder hasn't been created
  if (!fs.existsSync(`./${process.env.ROMEO_FOLDER}`)) {
    response.status(200);
    response.send([]);
    return;
  }

  // If the folder exists fetch the content
  const files = fs.readdirSync(`./${process.env.ROMEO_FOLDER}`);
  response.status(200);
  response.send(files);
});

// Fetch file information by filename
router.get('/:filename', (request, response) => {
  const filename = request.params.filename;

  // Make sure the file exists
  if (!fs.existsSync(`./${process.env.ROMEO_FOLDER}/${filename}`)) {
    response.status(404);
    response.send();
    return;
  }

  // Make sure the file extension is right
  if (path.extname(filename) !== `.pptx`) {
    response.status(422);
    response.send();
    return;
  }

  // Fetch statistics about the file
  const statistics = fs.statSync(`./${process.env.ROMEO_FOLDER}/${filename}`);
  const filesize = statistics.size / 1048576;
  const creation = statistics.birthtime;

  // Return the object
  response.status(200);
  response.send({
    filesize,
    filename,
    creation
  });
});

router.delete('/delete/:filename', (request, response) => {
  const filename = request.params.filename;

  // Make sure the file exists
  if (!fs.existsSync(`./${process.env.ROMEO_FOLDER}/${filename}`)) {
    response.status(404);
    response.send();
    return;
  }

  // Make sure the file extension is right
  if (path.extname(filename) !== `.pptx`) {
    response.status(422);
    response.send();
    return;
  }

  // Delete the file
  fs.unlinkSync(`./${process.env.ROMEO_FOLDER}/${filename}`);
  response.status(200);
  response.send();
});

router.post('/upload', async (request, response) => {
  const form = new formidable.IncomingForm();

  form.parse(request, (formError, formFields, formFiles) => {
    // If we get an error for some reason return 500
    if (formError) {
      response.status(500);
      response.send();
      return;
    }

    const uploadName = formFiles.powerpoint.name;
    const uploadPath = formFiles.powerpoint.path;
    const uploadSize = formFiles.powerpoint.size;

    // Make sure the file doesn't exist
    if (fs.existsSync(`./${process.env.ROMEO_FOLDER}/${uploadName}`)) {
      response.status(409);
      response.send();
      return;
    }

    // If file is larger than 64MB
    if (uploadSize > 67108864) {
      response.status(413);
      response.send();
      return;
    }

    // Fetch the folder size using an async package
    size(`./${process.env.ROMEO_FOLDER}`, (folderError, folderSize) => {
      // If we get an error for some reason return 500
      if (folderError) {
        response.status(500);
        response.send();
        return;
      }

      // Make sure we don't exceed 10GB
      if (folderSize + uploadSize > 10926161920) {
        response.status(507);
        response.send();
        return;
      }

      // Make sure the folder exist
      if (!fs.existsSync(`../${process.env.ROMEO_FOLDER}`)){
        fs.mkdirSync(`../${process.env.ROMEO_FOLDER}`);
      }

      const newPath = `${path.resolve()}/../${process.env.ROMEO_FOLDER}/${uploadName}`;

      // If we've gotten here we can move the file to the PowerPoint folder
      fs.renameSync(uploadPath, newPath);
      response.status(200);
      response.send();
    });
  });
});

export default router;
