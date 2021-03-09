"use strict";

// Import slideshow type
import Slideshow from "slideshow";

// Import required packages
import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

let powerpointName = "";

router.get("/", async (request, response) => {
  const slider: Slideshow = request.app.get("slider");
  const powerpoint = await fetchPowerpoint(slider);

  response.status(200);
  response.send(powerpoint);
});

router.put("/", async (request, response) => {
  const index = request.body.index;
  const filename = request.body.filename;

  // Fetch the slideshow instance
  const slider: Slideshow = request.app.get("slider");

  if (index) {
    // Check if a PowerPoint has been loaded
    const stats = await slider.stat();
    const loaded = stats.position >= 0 && stats.slides >= 0;

    // Return an error if no PowerPoint has been loaded
    if (!loaded) {
      response.status(404);
      response.send("No PowerPoint loaded");
      return;
    }

    // Validate input
    const isNumber = Number.isInteger(index);
    const inRange = index > 0 && index <= stats.slides;

    if (!isNumber || !inRange) {
      response.status(422);
      response.send("Invalid 'index' property");
      return;
    }

    // Update the index
    await updateIndex(index, slider);
  }

  if (filename) {
    // Make sure the file exists
    if (!fs.existsSync(`./${process.env.ROMEO_FOLDER}/${filename}`)) {
      response.status(404);
      response.send("File not found");
      return;
    }

    // Make sure the file extension is right
    if (path.extname(filename) !== ".pptx") {
      response.status(400);
      response.send("Invalid file extension");
      return;
    }

    await updateFilename(filename, slider);
  }

  // Fetch the settings and return it
  const settings = await fetchPowerpoint(slider);
  response.status(200);
  response.send(settings);
});

function updateIndex(index: number, slider: Slideshow) {
  slider.goto(index + 1);
}

async function updateFilename(filename: string, slider: Slideshow) {
  // Close the previous PowerPoint if it exists
  const statistics = await slider.stat();
  if (statistics.position >= 0 && statistics.slides >= 0) slider.close();

  // Open the PowerPoint and assign new name
  await slider.open(`./${process.env.ROMEO_FOLDER}/${filename}`);
  await slider.start();

  powerpointName = filename;
}

async function fetchPowerpoint(slider: Slideshow) {
  // Check if a PowerPoint has been loaded
  const stats = await slider.stat();
  const loaded = stats.position >= 0 && stats.slides >= 0;

  let slides: string[] = [];

  // If a PowerPoint has been loaded fetch the slides
  if (loaded) {
    const info = await slider.info();
    slides = info.titles;
  }

  // Return the object
  return {
    index: loaded ? stats.position - 1 : -1,
    slides: loaded ? slides : [],
    filename: loaded ? powerpointName : null
  };
}

export default router;
