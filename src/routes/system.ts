'use strict';

// Import required packages
import express from 'express';
import Slideshow from 'slideshow';

let intervalId: NodeJS.Timeout;
let intervalValue = 30000;
let intervalPlaying = false;

const router = express.Router();

router.get('/', async (request, response) => {
  const settings = await fetchSettings();
  response.status(200);
  response.send(settings);
});

router.put('/', async (request, response) => {
  const interval = request.body.interval;
  const playing = request.body.playing;

  // Fetch the slideshow instance
  const slider: Slideshow = request.app.get('slider');

  if (interval) {
    // Validate the property type and range
    const isNumber = Number.isInteger(interval);
    const inRange = interval >= 100 && interval <= 2147483647;

    if (!isNumber || !inRange) {
      response.status(422);
      response.send(`Invalid 'interval' property`);
      return;
    }

    await updateInterval(interval, slider);
  }

  if (playing) {
    // Validate the property type
    const isBoolean = typeof playing === `boolean`;

    if (!isBoolean) {
      response.status(422);
      response.send(`Invalid 'playing' property`);
      return;
    }

    await updatePlaying(playing, slider);
  }

  // Fetch the settings and return it
  const settings = await fetchSettings();
  response.status(200);
  response.send(settings);
});

async function updateInterval(interval: number, slider: Slideshow) {
  // Make sure the interval has changed
  if (interval !== intervalValue) {
    intervalValue = interval;
    clearInterval(intervalId);

    // Set the new interval
    intervalId = setInterval(() => {
      nextSlide(slider);
    }, intervalValue);
  }
}

async function updatePlaying(playing: boolean, slider: Slideshow) {
  // Make sure the playing value has changed
  if (playing !== intervalPlaying) {
    intervalPlaying = playing;

    // Start the interval again
    if (playing) {
      intervalId = setInterval(() => {
        nextSlide(slider);
      }, intervalValue);
    }

    // Cancel the playing interval
    if (!playing) clearInterval(intervalId);
  }
}

async function fetchSettings() {
  return {
    playing: intervalPlaying,
    interval: intervalValue
  };
}

async function nextSlide(slider: Slideshow) {
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
}

export default router;
