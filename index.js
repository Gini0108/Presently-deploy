const Slideshow = require("slideshow");


const express = require('express');
const dotenv = require('dotenv');
const events = require('events');

global.event = new events.EventEmitter();
global.slideshow = new Slideshow("powerpoint");

slideshow.boot();

global.intervalId = ``;
global.intervalVale = 5000;
global.intervalPlaying = false;

event.on('play', () => {
  intervalPlaying = true;
});

event.on('pause', () => {
  intervalPlaying = false;
});

event.on('interval', (intervalParameter) => {
  intervalValue = intervalParameter;

  clearInterval(intervalId);

  setTimeout(async () => {
    if (intervalPlaying) {
      const stats = await slideshow.stat();

      if (stats.position > 0 && stats.slides > 0) {
        if (stats.position + 1 > stats.slides) slideshow.goto(0);
        else slideshow.next();
      }
    }
  }, intervalValue)
});

// Load the .ENV variables
dotenv.config();

// Create the Express app
const app = express();

// Allow anything TBH
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Load external routes
const files = require('./routes/files');
const system = require('./routes/system');
const powerpoint = require('./routes/powerpoint');
const slideshow = require("slideshow");

app.use('/files', files);
app.use('/system', system);
app.use('/powerpoint', powerpoint);

// Listen to selected port
app.listen(process.env.ROMEO_PORT);