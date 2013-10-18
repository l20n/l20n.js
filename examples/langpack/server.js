var fs = require('fs');
var path = require('path');
var express = require('express');

var available = {
  'settings.gaiamobile.org': {
    de: 1.0,
    pl: 1,
    hu: 1,
  },
  'localhost': {
    pl: 3
  }
}

var languageNames = {
  'de': 'Deutsch',
  'pl': 'Polski',
  'hu': 'Magyar',
};

var app = express();
app.use(allowCrossDomain);

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');

  if (req.method === 'OPTIONS') {
    console.log('dostalem options')
    res.send(200);
  } else {
    next();
  }
};

app.get('/', function(req, res) {
  res.send('Hello\n');
});

app.get('/available', function(req, res){
  console.log('AVAILABLE')
  console.log(req.query)
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

var store = path.join.bind(path, __dirname, 'resources');

app.get('/resource', function(req, res){
  console.log('RESOURCE')
  console.log(req.query)
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
      relpath = path.resolve('/', relpath)
      // don't look at the next line
      // 
      // really, there be dragons...
      relpath = relpath.replace('/'+req.query.locale+'/', '/{{locale}}/');
      relpath = relpath.replace('.'+req.query.locale+'.', '.{{locale}}.');
      ret[relpath] = fs.readFileSync(p, 'utf8');
    }
  });

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

