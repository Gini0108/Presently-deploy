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
      res.send();
      return;
    };
  
    // Make sure the file extension is right
    if (path.extname(filename) !== `.pptx`) {
      res.status(422);
      res.send();
      return;
    };

    // Load the new PowerPoint and start the presentation
    await slideshow.open(`./${process.env.ROMEO_FOLDER}/${filename}`);
    await slideshow.start();

    res.status(200);
    res.send();
  });

  return router;
  
})();
