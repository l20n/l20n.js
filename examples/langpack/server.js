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
  var resource = store(req.query.domain, req.query.locale);

  if (!fs.existsSync(resource)) {
    res.send(404);
    return;
  }
  var list = walk(resource);
  
  var ret = {};
  list.forEach(function(p) {
    if (path.extname(p) === '.l20n') {
      var relpath = path.relative(resource, p);
      // don't look at the next line
      // 
      // really, there be dragons...
      relpath = relpath.replace('/'+req.query.locale+'/', '/{{locale}}/');
      ret[relpath] = fs.readFileSync(p, 'utf8');
    }
  });

  //var ast = parser.parse(data.toString());
  res.send(ret);
});

var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file))
        else results.push(file)
    })
    return results
}

app.listen(3000);

