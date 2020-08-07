const express = require('express');
const dotenv = require('dotenv');
const events = require('events');

global.playingValue = false;
global.intervalValue = 5000;

global.event = new events.EventEmitter();

event.on('play', () => {
  playingValue = true;
});

event.on('pause', () => {
  playingValue = false;
});

event.on('interval', (interval) => {
  intervalValue = interval;
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
// const powerpoint = require('./routes/powerpoint');

app.use('/files', files);
app.use('/system', system);
// app.use('/powerpoint', powerpoint);

// Listen to selected port
app.listen(process.env.ROMEO_PORT);