// web.js
var express 				= require("express");
var logfmt 					= require("logfmt");
var bodyParser     	= require('body-parser');
var methodOverride 	= require('method-override');
var app 						= express();
var http      			= require("http");
var server    			= http.createServer(app);
var path      			= require('path');
var log       			= require('./libs/log')(module);
var config    			= require('./libs/config');
var mongoose  			= require("mongoose");

app.use(logfmt.requestLogger());
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT

var router = express.Router(); 				// get an instance of the express Router
// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

routes = require('./config/routes')(app);

app.get('/', function(req, res) {
  res.send('Hello World!');
});

// var port = Number(process.env.PORT || 5000);
// app.listen(port, function() {
//   console.log("Listening on " + port);
// });

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
config.get('mongoose:uri');

var theport = process.env.PORT || config.get('port');

// Conexión
mongoose.connect(uristring, function(err, res) {
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  } else {
        console.log('Connected to Database');
        server.listen(process.env.PORT || config.get('port'), process.env.IP || config.get('localhost'), function(){
            var addr = server.address();
            console.log("Node start at ", addr.address + ":" + addr.port);
        });
  }
});