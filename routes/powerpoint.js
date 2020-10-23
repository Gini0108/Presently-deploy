// Import required packages
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Router instance
const router = express.Router();

module.exports = (function() {

  router.get('/:filename', async function(req, res) {
    const filename = req.params.filename;
  
    // Make sure the file exists
    if (!fs.existsSync(`./${process.env.ROMEO_FOLDER}/${filename}`)) {
      res.status(404);
      res.send(`File not found`);
      return;
    };
  
    // Make sure the file extension is right
    if (path.extname(filename) !== `.pptx`) {
      res.status(400);
      res.send(`Invalid file extension`);
      return;
    };

    // Load the new PowerPoint and start the presentation
    slideshow.open(`./${process.env.ROMEO_FOLDER}/${filename}`).then(() => {
      slideshow.start().then(() => {
        res.status(200);
        res.send();
      }).catch(() => {
        res.status(500)
        res.send('A unknown error occurred')
      });
    }).catch(() => {
      res.status(500)
      res.send('A unknown error occurred')
    });

    res.status(200);
    res.send();
  });

  router.get('/', async function(req, res) {
    const stats = await slideshow.stat();

    // Make sure a powerpoint has been loaded
    if (stats.slides < 0) {
      res.status(404);
      res.send('No PowerPoint loaded');
      return;
    }

    // Fetch the info
    slideshow.info()
      .then((info) => {
        res.status(200);
        res.send(info.titles);
      })
      .catch(() => {
        res.status(500)
        res.send('A unknown error occurred')
      });
  });

  router.get('/slide/:index', async function(req, res) {
    // Make sure the input is a number
    if (Number.isInteger(req.params.index)) {
      res.status(400);
      res.send(`Slide index must be a number`);
      return;
    }

    const stats = await slideshow.stat();
    const index = parseInt(req.params.index) + 1;

    // Make sure a powerpoint has been loaded
    if (stats.slides < 0) {
      res.status(404);
      res.send('No PowerPoint loaded');
      return;
    }

    // Make sure the slide is a valid index
    if (index < 0 || index >= stats.slides) {
      res.status(400);
      res.send('Slide index is out of range');
      return;
    }

    // Switch to the correct slide
    slideshow.goto(index)
      .then(() => res.status(200))
      .catch(() => {
        res.status(500)
        res.send('A unknown error occurred')
      });
  });

  return router;
  
})();
