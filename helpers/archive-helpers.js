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



exports.searchArchive = function(res, url){
  console.log("Inside of search Archive", exports.paths.archivedSites);
  fs.readFile(exports.paths.archivedSites + '/' + url, 'utf8', function(notFound, data){
    if (notFound){
      exports.isUrlInList(url);
      fs.readFile(exports.paths.siteAssets + '/loading.html', 'utf8', function(notFound, data){
        if (notFound){
          console.error(notFound);
        } else {
          http.serveAssets(res, data);
        }
      });
    } else {
      http.serveAssets(res, data);
    }
  });
};


exports.isUrlInList = function(url){
  fs.readFile(exports.paths.list, 'utf8', function(err, data){
    if (err){
      console.error(err);
    } else {
        // convert text from file into array
      var allLinks = data.replace(/\n/g,' ').split(' ');
      if (_.contains(allLinks, url)){
        return true;
      } else {
        exports.addUrlToList(url);
      }
    }
  });
};



// Add url to list
exports.addUrlToList = function(url){
  fs.appendFile(exports.paths.list, url + '\n', function(err){
    if(err){
      console.error(err);
      http.sendResponse(err);
    }
  });
};

// Checks for archived html file
exports.isUrlArchived = function(url){
  fs.exists(exports.paths.archivedSites + url,function(err){
    if(err){
      console.log('File not found.');
      return false;
    } else{
      console.log('File found.');
      return true;
    }
  });
};




exports.downloadUrls = function(){
  fs.readFile(exports.paths.list,'utf8',function(err,data){
    if(err){
      console.error(err);
    } else {
      var sites = data.replace(/\n/g,' ').split(' ');
      _.each(sites,function(site){
        if(!exports.isUrlArchived(site)){
          exports.archiveUrls(site);
        }
      });
    }
  });
};



exports.archiveUrls = function(url){
  console.log('Archiving HTML.');
  scraper('http:/' + url, function(err, response, body){
    if (err){
      console.error(err);
    } else{
      fs.writeFile(exports.paths.archivedSites + url, body, function(err){
        if (err){
          console.error(err);
          http.sendResponse(404);
        } else{
          http.sendResponse(200);
        }
      });
      http.sendResponse(201);
    }
  });
};
