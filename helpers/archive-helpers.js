/* global exports, require */

var fs = require('fs');
var path = require('path');
var scraper = require('request');
var _ = require('underscore');
var http = require('../web/http-helpers');
// var scraper = require('../workers/htmlfetcher');
exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// Accesses and reads text file containing urls
exports.readListOfUrls = function(req, res){
  fs.readFile(exports.paths.list, 'utf8', function(err,data){
    if(err){
      console.error(err);
    } else {
      exports.isUrlInList(req, res, data);
    }
  });
};

exports.isUrlInList = function(req, res, data){
  var url = req.url.slice(1); // Removes leading '/' from url
  // converts text from file into array
  var allLinks = data.replace(/\n/g,' ').split(' ');
  var listedInSites = false;
  // search for url in list
  _.each(allLinks,function(link){
    if(link === url){
      listedInSites = true;
    }
  });
  // in list, check if archived
  if (listedInSites){
    exports.isUrlArchived(req, res);
  } else{
    // not in list, add to list
    exports.addUrlToList(req, res);
    exports.downloadUrls(req, res);
  }
};

// Add url to list
exports.addUrlToList = function(req, res){
  url = req.url.slice(1);
  fs.appendFile(exports.paths.list, url + '\n', function(err){
    if(err){
      console.error(err);
      http.sendResponse(err);
    }
  });
  http.serveAssets(res, exports.paths.siteAssets + '/loading.html');
};

// Checks for archived html file
exports.isUrlArchived = function(req, res){
  fs.readFile(exports.paths.archivedSites + req.url, "utf8", function(err, data){
    // If error (file not found), send back loading page
    if(err){
      console.log('File not found.');
      // read loading html page
      exports.downloadUrls(req, res);
      http.serveAssets(res, exports.paths.siteAssets + '/loading.html');
    } else{
      // send back archived html
      console.log('File found.');
      http.sendResponse(res, data);
    }
  });
};

exports.downloadUrls = function(req, res){
  console.log('Archiving HTML.');
  scraper('http:/' + req.url, function(err, response, body){
    if (err){
      console.error(err);
    } else{
      fs.writeFile(exports.paths.archivedSites + req.url, body, function(err){
        if (err){
          console.error(err);
          http.sendResponse(res, '404');
        } else{
          http.sendResponse(res, body);
        }
      });
      http.sendResponse(res, body);
    }
  });
};
