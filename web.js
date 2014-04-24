// web.js
var express 	= require("express");
var logfmt 		= require("logfmt");
var app 			= express();
var http      = require("http");
var server    = http.createServer(app);
var path      = require('path');
var log       = require('./libs/log')(module);
var config    = require('./libs/config');
var mongoose  = require("mongoose");

app.use(logfmt.requestLogger());

app.use(function(req, res, next){
  res.status(404);
  log.debug('Not found URL: %s',req.url);
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  log.error('Internal error(%d): %s',res.statusCode,err.message);
  res.render('500', { error: err });
});

routes = require('./config/routes')(app);

app.get('/', function(req, res) {
  res.send('Hello World!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});