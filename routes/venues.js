require('dotenv').load();

var express = require('express');
var router = express.Router();
var https = require('https');
var request = require('request');

/* GET venues listing. */
router.get('/', function(req, res, next) {
  res.send('venues page');
});

var clientId = 'D3XCQHVESV4KMC2KTYCEKXRYE11U4FZOKPKDLYPZBAZPQE0D';
var clientSecret = 'TJ1HYBNMZ0MVMA21Z4YVIOT4G3DOALEGFNHLPN4AOY5NPWG5';


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
  console.log(search);
  venues();
});

module.exports = router;
