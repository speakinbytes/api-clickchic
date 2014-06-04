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
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/app/views');
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router(); 

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	log.info('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

routes = require('./config/api_routes')(app);
routes = require('./config/web_routes')(app);

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/HelloMongoose';
//config.get('mongoose:uri');

var port  = process.env.PORT || config.get('port');
var ip    = process.env.IP || config.get('localhost');

// Conexión
mongoose.connect(uristring, function(err, res) {

  if(err) {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  } 
  else {
    console.log('Succeeded connected to: ' + uristring);
    server.listen(port, function(){
      var addr = server.address();
      console.log("Node start at ", addr.address + ":" + addr.port);
    });
  }
});
// var connectWithRetry = function() {
//   console.log("......");
//   return mongoose.connect(uristring, function(err) {
//     if (err) {
//       console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
//       setTimeout(connectWithRetry, 5000);
//     }
//     else console.log("...fsda");
//   });

// };
// connectWithRetry();
