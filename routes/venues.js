require('dotenv').load();

var express = require('express');
var router = express.Router();
var https = require('https');
var request = require('request');

/* GET venues listing. */
router.get('/', function(req, res, next) {
  res.send('venues page');
});

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;


router.post('/', function(req, res, next){
  var searchParams = req.body;

  var search = 'https://api.foursquare.com/v2/venues/search?near=' + req.body.location +  '&client_id=' + clientId + '&client_secret=' + clientSecret + '&query=' + req.body.keyword + '&intent=checkin&v=20151121';

  var venues = function(){
    request(search, function(err, res, body){
    if (err){
      console.error(err);
      }
    })
    .pipe(res)
    .on('error', function(err){
      console.error(err);
    });
  };
  venues();
});

module.exports = router;
