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

routes = require('./config/api_routes')(app);
routes = require('./config/web_routes')(app);

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/HelloMongoose';

// Handle errors
app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

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

    // var dataGen = require("./config/dataGen.js");

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
