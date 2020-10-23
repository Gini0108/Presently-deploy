// Import required packages
const express = require('express');
const size = require('get-folder-size');

// Create Router instance
const router = express.Router();

function generateObject() {
  // Create a promise since the get-folder-size doesn't support await
  return new Promise((resolve, reject) => {
    // Fetch the current folder size
    size(`./${process.env.ROMEO_FOLDER}`, (error, size) => {
      // If we get an error for some reason return 500
      if (error) reject(error);
      
      // Fetch storage values and convert to MB
      const storageValue = {
        current: size / 1048576,
        max: 10420,
      }
      
      // Create the object and return it
      resolve({
        intervalPlaying: playingValue,
        intervalVale: intervalValue,
        storage: storageValue,
      });
    });
  });
}

module.exports = (function() {

  // Get system statistics
  router.get('/', async function (req, res) {
    const object = await generateObject();

    res.status(200);
    res.send(object);
  });

  // Trigger PowerPoint playing
  router.get('/play', async function (req, res) {

    // Update the global playing state
    event.emit('play');

    const object = await generateObject();

    res.status(200);
    res.send(object);
  });

  // Trigger PowerPoint playing
  router.get('/pause', async function (req, res) {

    // Update the global playing state
    event.emit('pause');

    const object = await generateObject();

    res.status(200);
    res.send(object);
  });

  router.get('/interval/:value', async function(req, res) {
    let value = req.params.value;

    // Make sure the value is a number
    if (value != parseInt(value)) {
      console.log("Its not a number!");
      res.status(400);
      res.send();
      return;
    };

    // Make sure the value isn't to high or low
    if (value <= 100 || value >= 2147483647) {
      res.status(400);
      res.send();
      return;
    }

    // Update the global playing state
    event.emit('interval', value);

    const object = await generateObject();

    res.status(200);
    res.send(object);
  });

  return router;
  
})();
