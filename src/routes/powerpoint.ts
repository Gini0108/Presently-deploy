'use strict';

// Import slideshow type
import Slideshow from 'slideshow';

// Import required packages
import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/:filename', async (request, response) => {
  const filename = request.params.filename;

  // Make sure the file exists
  if (!fs.existsSync(`./${process.env.ROMEO_FOLDER}/${filename}`)) {
    response.status(404);
    response.send(`File not found`);
    return;
  }

  // Make sure the file extension is right
  if (path.extname(filename) !== `.pptx`) {
    response.status(400);
    response.send(`Invalid file extension`);
    return;
  }

  const slider: Slideshow = request.app.get('slider');

  // Close the previous PowerPoint if it exists
  const statistics = await slider.stat();
  if (statistics.position >= 0 && statistics.slides >= 0) slider.close();

  // The PowerPoint package can be a bit jank so I tried to catch every error
  slider
    .open(`./${process.env.ROMEO_FOLDER}/${filename}`)
    .then(() => {
      slider
        .start()
        .then(() => {
          response.status(200);
          response.send();
        })
        .catch(() => {
          response.status(500);
          response.send('A unknown error occurred');
        });
    })
    .catch(() => {
      response.status(500);
      response.send('A unknown error occurred');
    });

  response.status(200);
  response.send();
});

router.get('/', async (request, response) => {
  const slider: Slideshow = request.app.get('slider');
  const statistics = await slider.stat();

  // Make sure a powerpoint has been loaded
  if (statistics.position < 0 || statistics.slides < 0) {
    response.status(404);
    response.send('No PowerPoint loaded');
    return;
  }

  // Fetch the info
  slider
    .info()
    .then((info) => {
      response.status(200);
      response.send(info.titles);
    })
    .catch(() => {
      response.status(500);
      response.send('A unknown error occurred');
    });
});

router.get('/slide/:index', async (request, response) => {
  // Make sure the input is a number
  if (Number.isInteger(request.params.index)) {
    response.status(400);
    response.send(`Slide index must be a number`);
    return;
  }

  const slider: Slideshow = request.app.get('slider');

  const statistics = await slider.stat();
  const index = parseInt(request.params.index, 10) + 1;

  // Make sure a powerpoint has been loaded
  if (statistics.slides < 0) {
    response.status(404);
    response.send('No PowerPoint loaded');
    return;
  }

  // Make sure the slide is a valid index
  if (index < 0 || index >= statistics.slides) {
    response.status(400);
    response.send('Slide index is out of range');
    return;
  }

  // Switch to the correct slide
  slider
    .goto(index)
    .then(() => {
      response.status(200);
      response.send();
    })
    .catch(() => {
      response.status(500);
      response.send('A unknown error occurred');
    });
});

export default router;
