"use strict";

import Slideshow from 'slideshow';
import express from 'express';
import dotenv from 'dotenv';

global.slideshow = new Slideshow("powerpoint");
global.slideshow.boot();

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
import files from './routes/files.js';
import system from './routes/system.js';
import powerpoint from './routes/powerpoint.js';

app.use('/files', files);
app.use('/system', system);
app.use('/powerpoint', powerpoint);

// Listen to selected port
app.listen(process.env.ROMEO_PORT);