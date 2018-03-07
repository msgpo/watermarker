const express = require('express');
const watermark = require('image-watermark');

const caption = require('caption');

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
    // const defaultOverlayText = 'Follow me for chart analysis or join my discord at http://cryptodam.us';
    const defaultOverlayText = 'Follow Me on http://cryptodam.us';
    const overlayText = req.query.text || defaultOverlayText;

    if (!imagePath || !overlayText) {
      res.send('Error, please provide correct parameters');
    }

    fetchImage(imagePath, 'source.png', () => {
        caption.path('./source.png',{
          caption : overlayText,
          bottomCaption: 'Charts, Alerts, Community',
          outputFile : 'watermark.png',
          minHeight: 300,
          minWidth: 700
        },function(err,filename){
          res.download(`./watermark.png`, 'output.png');
        })

    });

});

app.listen(1337, () => console.log('Watermarker initiated'))