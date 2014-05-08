var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var url = require('url');
// require more modules/folders here!



exports.handleRequest = function (req, res) {
  if(req.method === 'POST'){
    var data = '';
    req.on('data', function(partialData){
      data += partialData;
    });

    req.on('end', function(){
      req.url = '/' + data.slice(4);
      console.log(req);
      archive.readListOfUrls(req, res);
    });

  }
  if(req.method === 'GET'){
    http.serveAssets(res, archive.paths.siteAssets + '/index.html');
  }
};
