var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var url = require('url');
var fs = require('fs');
// require more modules/folders here!



exports.handleRequest = function (req, res) {
  if(req.method === 'POST'){
    var data = '';
    req.on('data', function(partialData){
      data += partialData;
    });

    req.on('end', function(){
      url = data.slice(4);
      archive.searchArchive(res, url);
    });

  }
  if(req.method === 'GET'){
    fs.readFile(archive.paths.siteAssets + '/index.html', 'utf8', function(err, data){
      if (err){
        console.error(err);
        http.serveAssets(res, 404);
      } else {
        http.serveAssets(res, data);
      }
    });
  }
};
