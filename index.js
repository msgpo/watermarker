const express = require('express');
const watermark = require('image-watermark');

const fs = require('fs'),
request = require('request');

const fetchImage = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
  console.log('content-type:', res.headers['content-type']);
  console.log('content-length:', res.headers['content-length']);

  request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

const app = express();

// Takes a query for image, process it, add watermark, return processed image

app.get('/', (req, res) => {
    const imagePath = req.query.image;
    const overlayText = req.query.text;
    if (!imagePath || !overlayText) {
      res.send('Error, please provide correct parameters');
    }

    fetchImage(imagePath, 'source.png', () => {
        const options = {
          text : overlayText,
          font: 'arial',
          align: 'ltr',
          color: 'rgb(255, 255, 255)'
        };
        watermark.embedWatermarkWithCb('./source.png', options, (err) => {
          if (!err) {
            res.download('./watermark.png', 'output.png');
          }
        });

    });

});

app.listen(1337, () => console.log('Watermarker initiated'))