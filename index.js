const Express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const Slidehow = require("slideshow");
const size = require('get-folder-size');
const fs = require('fs');

// Load .ENV file
dotenv.config();

// Create the powerpoint folder if need be
if (!fs.existsSync(`./${process.env.ROMEO_FOLDER}`)){
  fs.mkdirSync(`./${process.env.ROMEO_FOLDER}`);
}

const app = Express()

const slideshow = new Slidehow("powerpoint");

let loaded = null;

slideshow.boot()
.then(function () {
  app.listen(process.env.ROMEO_PORT);
});

// var slideshow = new SlideShow("Keynote")
// slideshow.boot()
// .then(function () { slideshow.open("pres.pptx") })
// .then(function () { slideshow.start() })
// .then(function () { slideshow.goto(2) })
// .delay(2*1000)
// .then(function () { slideshow.stop() })
// .then(function () { slideshow.close() })
// .then(function () { slideshow.quit() })
// .then(function () { slideshow.end() })
// .done()

// Start Express server on the .ENV port
app.get('/files', function (req, res) {
  // Get all files
  const files = fs.readdirSync(`./${process.env.ROMEO_FOLDER}`)

  res.status(300);
  res.send(files)
})

app.get('/files/:filename', async function(req, res) {
  const filename = req.params.filename;

  // Make sure the file exists
  if (!fs.existsSync(`./${process.env.ROMEO_FOLDER}/${filename}`)) {
    res.status(404);
    res.send('This powerpoint could not be found!');
    return;
  };

  // Make sure the file extension is right
  if (path.extname(filename) !== `.pptx`) {
    res.status(500);
    res.send(`This file doesn't have a .pptx file extension!`);
    return;
  };

  await slideshow.open(`./${process.env.ROMEO_FOLDER}/${filename}`);
  await slideshow.start();

  loaded = filename;

  res.status(300);
  res.send(`This powerpoint has been loaded!`);
});

app.post('/files/upload', function (req, res) {
  const form = new formidable.IncomingForm();

  // Parse the form request
  form.parse(req);

  // Write the file to storage
  form.on('fileBegin', function (name, file) {
      file.path = `${__dirname}/${process.env.ROMEO_FOLDER}/${file.name}`;
  });

  res.status(200);
});

app.get('/slides/:index', async function(req, res) {
  const info = await slideshow.info();

  const index = req.params.index;
  const length = info.titles.length;

  // Make sure the index is a number
  if (index != parseInt(index)) {
    res.status(500);
    res.send(`This is not a valid slide number!`);
    return;
  };

  if (index < 1 || index > length) {
    res.status(500);
    res.send(`There is no slide at this index`);
    return;
  }

  await slideshow.goto(index);

  res.status(300);
  res.send(`Switched to the correct slide!`);
});