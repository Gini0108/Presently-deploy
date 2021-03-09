"use strict";

import dotenv from "dotenv";
import express from "express";
import Slideshow from "slideshow";

import files from "./routes/files.js";
import system from "./routes/system.js";
import powerpoint from "./routes/powerpoint.js";

// Initialize the most recent PowerPoint version
const slider = new Slideshow("powerpoint");

// Initilize the packages
slider.boot();
dotenv.config();

// Initialize the Express server
const app = express();

app.use(express.json());
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  response.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});

app.use("/files", files);
app.use("/system", system);
app.use("/powerpoint", powerpoint);

app.set("slider", slider);
app.listen(process.env.ROMEO_PORT);
