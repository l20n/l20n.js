var fs = require('fs');
var path = require('path');
var express = require('express');
var Parser = require('../../lib/l20n/parser').Parser;

var app = express();
var parser = new Parser();
var store = path.join.bind(path, __dirname, 'resources');

var available = {
  'settings.gaiamobile.org': {
    de: 1.0,
  }
}

var languageNames = {
  'de': 'Deutsch',
  'pl': 'Polski',
};

app.get('/available', function(req, res){
  res.set('Access-Control-Allow-Origin', '*');
  var langs = {};

  var domains = req.query.domains.split(',');
  domains.forEach(function(d) {
    if (available[d]) {
      langs[d] = available[d];
    }
  });
  res.send({
    'domains': langs,
    'nativeNames': languageNames
  });
});

app.get('/resource', function(req, res){
  res.set('Access-Control-Allow-Origin', '*');

  // XXX check if they all exist
  var resource = store(req.query.domain, req.query.version, req.query.uri);
  fs.readFile(resource, parse);

  function parse(err, data) {
    if (err) {
      return res.send(404);
    }
    var ast = parser.parse(data.toString());
    res.send(ast);
  }

});

app.listen(3000);

