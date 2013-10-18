var fs = require('fs');
var path = require('path');
var express = require('express');

var redis = require('redis');
var client = redis.createClient();

var languageNames = {
  'de': 'Deutsch',
  'pl': 'Polski',
  'hu': 'Magyar',
};

var app = express();
app.use(allowCrossDomain);
app.use(express.bodyParser());
app.set('views', __dirname);       
app.engine('html', require('ejs').renderFile);

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
  console.log('HELLO', req.query)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cache-Control', 'no-cache, private, no-store, ' +
             'must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.send('Hello\n');
});

app.get('/admin', function(req, res) {
  res.render('admin.html');
});

app.post('/set', function(req, res) {
  if (req.body.enable) {
    client.sadd(req.body.origin, req.body.locale, done);
  } else {
    client.srem(req.body.origin, req.body.locale, done);
  }
  function done(err) {
    res.send('ok')
  }
});

app.get('/available', function(req, res){
  console.log('AVAILABLE', req.query)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cache-Control', 'no-cache, private, no-store, ' +
             'must-revalidate, max-stale=0, post-check=0, pre-check=0');

  var langs = {};
  var domains = req.query.domains.split(',');
  var domainsToCheck = domains.length;
  domains.forEach(function(d) {
    langs[d] = {};
    client.smembers(d, function(err, locales) {
      for (var i in locales) {
        langs[d][locales[i]] = 3  // XXX hardcode the version number for now
      }
      if (--domainsToCheck === 0) {
        res.send({
          'domains': langs,
          'nativeNames': languageNames
        });
      }
    });
  });
});

var store = path.join.bind(path, __dirname, 'resources');

app.get('/resource', function(req, res){
  console.log('RESOURCE', req.query)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cache-Control', 'no-cache, private, no-store, ' +
             'must-revalidate, max-stale=0, post-check=0, pre-check=0');

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
console.log('  -- langpack server listening on port 3000');

