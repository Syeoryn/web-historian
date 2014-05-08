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

exports.serveAssets = function(req, res) {

// asset = archive.paths.siteAssets + '/index.html';
//   fs.readFile(asset, 'utf8', function(err, data){
//     if (err){
//       console.error(err);
//       res.end(404);
//     } else {
//       res.end(data);
//     }
//   });

var pathName = url.parse(req.url);
  console.log(pathName.pathname);
  if (pathName.pathname === '/'){
    fs.readFile(archive.paths.siteAssets + '/index.html', 'utf8', function(err, data){
      if (err){
        console.error(err);
        res.end(404);
      } else {
        res.end(data);
      }
    });
  } else if (pathName.pathname === '/styles.css'){
    fs.readFile(archive.paths.siteAssets + '/styles.css', 'utf8', function(err, data){
      if (err){
        console.error(err);
        res.end(404);
      } else {
        console.log('STYLES!')
        res.end(data);
      }
    });
  } else if (pathName.pathname === '/bower_components/jquery/dist/jquery.min.js'){
    fs.readFile(archive.paths.siteAssets + '/bower_components/jquery/dist/jquery.min.js', 'utf8', function(err, data){
      if (err){
        console.error(err);
        res.end(404);
      } else {
        console.log("JQUERY!");
        res.end(data);
      }
    });
  }
};



  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)


// As you progress, keep thinking about what helper functions you can put here!
//








// asset = asset || archive.paths.siteAssets + '/index.html';
//   // var ourScript = archive.paths.siteAssets +  '/styles.css';
//   // var jayQuery =
//   fs.readFile(asset, 'utf8', function(err, data){
//     if (err){
//       console.error(err);
//       res.end(404);
//     } else {
//       res.end(data);
//     }
//   });
