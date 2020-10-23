"use strict";

// Import required packages
import formidable from 'formidable';
import express from 'express';
import size from 'get-folder-size';
import path from 'path';
import fs from 'fs';

// Create Router instance
const router = express.Router();

// Get all files from folder
router.get('/', function (req, res) {
  const files = fs.readdirSync(`./${process.env.ROMEO_FOLDER}`)
  res.status(200);
  res.send(files)
});

router.get('/:filename', function(req, res) {
  const filename = req.params.filename;

  // Make sure the file exists
  if (!fs.existsSync(`./${process.env.ROMEO_FOLDER}/${filename}`)) {
    res.status(404);
    res.send();
    return;
  };

  // Make sure the file extension is right
  if (path.extname(filename) !== `.pptx`) {
    res.status(422);
    res.send();
    return;
  };

  let last = null;

  // Fetch the last used from the JSON file
  if (fs.existsSync(`./${process.env.ROMEO_FOLDER}/history.json`)) {
    const history = fs.readFileSync(`history.json`);
    const json = JSON.parse(history);    
    const last = json[filename] ? json[filename] : null;
  }

  // Fetch statistics about the file
  const stats = fs.statSync(`./${process.env.ROMEO_FOLDER}/${filename}`);
  const size = stats.size / 1048576;
  const creation = stats.birthtime;

  // Return the object
  res.status(200);
  res.send({
    size: size,
    last: last,
    filename: filename,
    creation: creation
  });
});

router.delete('/delete/:filename', function(req, res) {
  const filename = req.params.filename;

  // Make sure the file exists
  if (!fs.existsSync(`./${process.env.ROMEO_FOLDER}/${filename}`)) {
    res.status(404);
    res.send();
    return;
  };

  // Make sure the file extension is right
  if (path.extname(filename) !== `.pptx`) {
    res.status(422);
    res.send();
    return;
  };

  // Delete the file
  fs.unlinkSync(`./${process.env.ROMEO_FOLDER}/${filename}`);
  res.status(200);
  res.send();
});

router.post('/upload', async function(req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    const uploadName = files.powerpoint.name;
    const uploadPath = files.powerpoint.path;
    const uploadSize = files.powerpoint.size;

    // Make sure the file doesn't exist
    if (fs.existsSync(`./${process.env.ROMEO_FOLDER}/${uploadName}`)) {
      res.status(409);
      res.send();
      return;
    };

    // If file is larger than 64MB
    if (uploadSize > 67108864) {
      res.status(413);
      res.send();
      return;
    }

    // Fetch the folder size using an async package
    size(`./${process.env.ROMEO_FOLDER}`, (error, size) => {

      // If we get an error for some reason return 500
      if (error) {
        res.status(500);
        res.send();
        return;
      }

      // Make sure we don't exceed 10GB
      if (size > 10926161920) {
        res.status(507);
        res.send();
        return;
      }

      const newPath = `${__dirname}/../${process.env.ROMEO_FOLDER}/${uploadName}`;

      // If we've gotten here we can move the file to the PowerPoint folder
      fs.renameSync(uploadPath, newPath);
      res.status(200);
      res.send();
    });
  });
});

export default router;
