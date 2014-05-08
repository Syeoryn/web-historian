var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
// require more modules/folders here!



exports.handleRequest = function (req, res) {
  if(req.method === 'POST'){
    http.serveAssets(res);
    archive.readListOfUrls(req, res);
  }
  if(req.method === 'GET'){
    http.serveAssets(req, res);
  }
  // res.end(archive.paths.list);
};
