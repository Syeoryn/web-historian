var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url = require('url');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};

exports.serveAssets = function(res, asset) {
  fs.readFile(asset, 'utf8', function(err, data){
    if (err){
      exports.sendResponse(res,err);
    } else {
      exports.sendResponse(res,data);
    }
  });
};

exports.sendResponse = function(res,data){
  res.end(data);
};
