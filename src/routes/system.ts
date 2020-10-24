'use strict';

// Import required packages
import express from 'express';
import Slideshow from 'slideshow';
import { executeInterval, folderSize } from '../utils';

let intervalId;
let intervalValue = 30000;
let intervalPlaying = false;

const router = express.Router();

// Get system statistics
router.get('/', async (request, response) => {
  response.status(200);
  response.send({
    value: intervalValue,
    playing: intervalPlaying,
    storage: {
      maximum: 10420,
      current: await folderSize(`./${process.env.ROMEO_FOLDER}`)
    }
  });
});

// Trigger PowerPoint playing
router.get('/play', async (request, response) => {
  const slider: Slideshow = request.app.get('slider');

  // Only update the play state if its paused
  if (!intervalPlaying) {
    intervalPlaying = true;

    intervalId = setInterval(() => {
      executeInterval(slider);
    }, intervalValue);
  }

  response.status(200);
  response.send({
    value: intervalValue,
    playing: intervalPlaying,
    storage: {
      maximum: 10420,
      current: await folderSize(`./${process.env.ROMEO_FOLDER}`)
    }
  });
});

// Trigger PowerPoint playing
router.get('/pause', async (request, response) => {
  // Only update the play state if its playing
  if (intervalPlaying) {
    intervalPlaying = false;
    clearInterval(intervalId);
  }

  response.status(200);
  response.send({
    value: intervalValue,
    playing: intervalPlaying,
    storage: {
      maximum: 10420,
      current: await folderSize(`./${process.env.ROMEO_FOLDER}`)
    }
  });
});

router.get('/interval/:value', async (request, response) => {
  const slider: Slideshow = request.app.get('slider');

  // Make sure the value is a number
  if (Number.isInteger(request.params.value)) {
    response.status(400);
    response.send();
    return;
  }

  const interval = Number.parseInt(request.params.value, 10);

  // Make sure the value isn't to high or low
  if (interval <= 100 || interval >= 2147483647) {
    response.status(400);
    response.send();
    return;
  }

  // Make sure the value has changed
  if (interval !== intervalValue) {
    intervalValue = interval;
    clearInterval(intervalId);

    intervalId = setInterval(() => {
      executeInterval(slider);
    }, intervalValue);
  }

  response.status(200);
  response.send({
    value: intervalValue,
    playing: intervalPlaying,
    storage: {
      maximum: 10420,
      current: await folderSize(`./${process.env.ROMEO_FOLDER}`)
    }
  });
});

export default router;
