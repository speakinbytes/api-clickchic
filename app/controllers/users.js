/**
 * Module dependencies.
 */
var User = require('../models/user.js');
var log  = require('../../libs/log')(module);

/**
 * Show login form
 */

exports.signin = function(req, res) {
  log.info("POST - /api/v1/signin - signin");
  
  if (req.body.user_name && req.body.user_pass) {
    User.find({ id: req.body.user_id,  hashed_password: req.body.user_pass}, function(err, user) {
      if (user.length == 0) {
        res.statusCode = 204;
        log.info('Status(%d): %s',res.statusCode, "No find User");        
        return res.send({"status": "error"});
      }
      if(!err) {
        res.send({ "token" : user.id });
      } else {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.send({ error: 'Server error' });
      }
    });
  }
};

// POST - /api/v1/signup --> Insert a new User in the DB
// Params - username, email, password and role
exports.signup = function(req, res) {
  log.info('POST - /api/v1/user --> Creating user');
  log.info('Params - username: %s, email: %s, password: %s, role: %s', 
                     req.body.username, req.body.email, req.body.password, req.body.role);

  var user = new User({
    userName:         req.body.username,
    email:            req.body.email,
    hashed_password:  req.body.password,
    role:             req.body.role
  });

  user.save(function(err) {
    if(!err) {
      log.info("user created");
      res.statusCode = 201;
      res.send({ "status":"ok", "token": user.id});
    } else {
      if(err.name == 'ValidationError') {
        res.statusCode = 400;
        log.error('Validation error(%d): %s',res.statusCode,err.message);
        res.send('Validation error('+res.statusCode+'): '+err.message);
      } else {
        res.statusCode = 500;
        if (err.code == 11000) {
          log.error('Duplicate key');
          res.send({ status: "error", error: 'Duplicate key' });
        } else {
          log.error('Internal error(%d): %s',res.statusCode,err.message);
          res.send({ error: 'Server error' });
        }
        
        
      }
    }
  });
};
