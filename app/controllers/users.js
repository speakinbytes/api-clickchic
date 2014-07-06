/**
 * Module dependencies.
 */
var User        = require('../models/user.js');
var Product     = require('../models/product.js');
var Category    = require('../models/category.js');
var AccessToken = require('../models/access_token.js');
var log         = require('../../libs/log')(module);
var jwt         = require('jwt-simple');


// POST - /api/v1/login --> Insert a new User in the DB
// Params - username, email, password and role
exports.login = function(req, res) {
  log.info("POST - /api/v1/login - login. Email: " + req.body.email);

  if (req.body.email && req.body.password) {
    User.findOne({ email: req.body.email }, function(err, user) {
      if (!user) {
        res.statusCode = 200;
        log.info('Status(%d): %s',res.statusCode, "No find User");        
        return res.send({"status": "error", error_msg: "not email."});
      }
      if(!err) {
        if (!user.authenticate(req.body.password)) {
          log.error("Password incorrect!");
          res.statusCode = 200;
          return res.send({"status": "error", error_msg: "Incorrect password."});
        } else {
          log.info("User " + user.email + " logged in");
          res.statusCode = 200;
          console.log(":::::::: " + user.token);
          return res.send({ status: "ok", token : user.token });

          // ** If we use access_token <-- Uncomment if we need.
          // AccessToken.findOne( {user: user}, function(errToken, token) {
          //   console.log(token);
          //   if (!errToken && token) {
          //     res.statusCode = 200;
          //     return res.send({ status: "ok", "token" : token.token });
          //   }
          // });
        }
      } else {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.send({ error: 'Server error' });
      }
    });
  } else {
    res.statusCode = 200;
    res.send( { status: "error", error_msg: "Need params: email and password"} );
  }
};

// POST - /api/v1/register --> Insert a new User in the DB
// Params - username, email, password and role
exports.register = function(req, res) {
  log.info('POST - /api/v1/user --> Creating user');
  log.info('Params - username: %s, email: %s, password: %s, role: %s', 
                     req.body.username, req.body.email, req.body.password, req.body.role);

  // Needs all params
  if (req.body.username == null || req.body.email == null || req.body.password == null || req.body.role == null || req.body.secret == null) {
    res.statusCode = 200;
    return res.send({ status: "error", error_msg: "You need more inputs! Remember: username, email, password, role and secret." });
  };

  if (req.body.secret != "1click2bechic") {
    res.statusCode = 200;
    return res.send( { status: "error", error_msg: "Invalid secret!"} );
  }

  // Api Secret
  var secret = req.body.secret;

  // Users values
  var user = new User({
    userName:         req.body.username,
    email:            req.body.email,
    password:         req.body.password,
    role:             req.body.role
  });

  user.clickchick_count = 0;
  user.clickchics = [];
  user.products_count = 0;

  if (req.body.shop && req.body.shop != "") {
    user.shop.name = req.body.shop;
  }

  if (req.body.address && req.body.address != "") {
    user.shop.address = req.body.address;
  }

  if (req.body.web && req.body.web != "") {
    user.web = req.body.web;
  }

  if (req.body.twitter && req.body.twitter != "") {
    user.twitter.name = req.body.twitter;
  }

  if (req.body.lat && req.body.lat != "" && req.body.lon && req.body.lon != "") {
    user.shop.lat = req.body.lat;
    user.shop.lon = req.body.lon;
  }

  // create token
  var token = jwt.encode( { salt: user.salt, password: user.hashed_password }, secret);
  user.token = token;

  // Save users
  user.save(function(err) {
    if(!err) {
      log.info("user created");
      res.statusCode = 200;
      res.send({ "status":"ok", "token": token});

      // ** If we use access_token <-- Uncomment if we need.
      // var access_token = new AccessToken( {
      //   token:  token,
      //   user:   user
      // });

      // access_token.save(function(errToken) {
      //   if (!errToken) {
      //     res.statusCode = 201;
      //     res.send({ "status":"ok", "token": token});
      //   }
      //   else {
      //     res.statusCode = 500;
      //     log.error('Internal error(%d): %s', res.statusCode, errToken.message);
      //     res.send({ status: "error", error_msg: 'Error saving user' });
      //   }
      // });

    } else {
      if(err.name == 'ValidationError') {
        res.statusCode = 400;
        log.error('Validation error(%d): %s',res.statusCode,err.message);
        res.send( { status: "error", error_msg: 'Validation error('+res.statusCode+'): '+err.message } );
      } else {
        if (err.code == 11000) {
          res.statusCode = 200;
          log.error('Duplicate key');
          res.send({ status: "error", error_msg: 'Duplicate key' });
        } else {
          res.statusCode = 500;
          log.error('Internal error(%d): %s',res.statusCode,err.message);
          res.send({ status: "error", error_msg: 'Server error' });
        } 
      }
    }
  });
};

// POST - /api/v1/profile --> Insert a new User in the DB
// Params - profile
exports.profile = function(req, res) {
  log.info('POST - /api/v1/profile --> Show user profile');
  log.info('Params - token: %s, user_id: %s', 
                     req.body.token, req.body.user_id);

  // Input validations
  // Needs one params
  if (req.body.token == null && req.body.user_id == null) {
    return res.send({ status: "error", error_msg: "You need more params! Remember: token or user_id." });
  };
  // Not two params
  if (req.body.token != null && req.body.user_id != null) {
    return res.send({ status: "error", error_msg: "Only one param is accepted. token or user_id." });
  };

  var query  = req.body.token ? { token: req.body.token } : { _id : req.body.user_id };
  var dict = {};

  User.findOne(query, function(err, user) {
    if (user == null) {
      res.statusCode = 200;
      log.info('Status(%d): %s',res.statusCode, "No find User");        
      return res.send({"status": "error", error_msg: "Not user."});
    }
    if(!err) {
      if (user.role == "crafter") {
        res.statusCode = 200;
        res.send( { status: "error", error_msg: "You need be a seller."} );
      }
      else {
        if (user.role == "seller") {
          dict["email"] = user.email;
          dict["id"] = user.id;
          dict["username"] = user.userName;
          dict["clickchick_count"] = user.clickchick_count;
          dict["clickchics"] = user.clickchicks;
          dict["address"] = user.shop.address;
          dict["web"] = user.web;
          dict["twitter"] = user.twitter.name;
          dict["products_count"] = user.products_count;
          dict["lat"] = user.shop.lat;
          dict["lon"] = user.shop.lon;

          var query = {};
          query["seller_id"] = user._id;
          Product.find(query, function(err, products) {
            if (products.length == 0) {
              res.statusCode = 200;
              log.info('Status(%d): %s',res.statusCode, "No find products. :(");        
              return res.send( { status: "error", error_msg: "Not products." });
            }
            if(!err) {
              res.statusCode = 200;
              res.send( { status: "ok", user: dict, products: products } );
            } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s',res.statusCode,err.message);
              res.send({ status: "error", error_msg: 'Server error' });
            }
          });
        } else {

        }
      }
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      res.send({ error: 'Server error' });
    }
  });
}

//PUT - Update a User register already exists
exports.update = function(req, res) {
  log.info("PUT - /user - params token: " + req.body.token);

  // Input validations
  // Needs one params
  if (req.body.token == null) {
    return res.send({ status: "error", error_msg: "You need more params! Remember: token." });
  };

  return User.findOne( { token: req.body.token }, function(err, user) {
    if(!user) {
      res.statusCode = 200;
      return res.send({ status: "error", error_msg: 'Not user' });
    }

    // Fields for update
    if (req.body.username != null) user.userName = req.body.username;
    user.modified_at = new Date;

    var dict = {};
    user.save(function(err) {
      if(!err) {
        log.info('User: ' + user.email + ' was Updated');

        dict["email"] = user.email;
        dict["id"] = user.id;
        dict["username"] = user.userName;
        dict["clickchick_count"] = user.clickchick_count;
        dict["clickchics"] = user.clickchicks;

        res.send({ status: 'ok', user:dict });
      } else {
        if(err.name == 'ValidationError') {
          res.statusCode = 400;
          res.send({ status: "error", error_msg: 'Validation error' });
        } else {
          res.statusCode = 500;
          if (err.code == 11000) {
            log.error('Duplicate key');
            res.send({ status: "error", error_msg: 'Duplicate key' });
          } else {
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            res.send({ status: "error", error_msg: 'Server error' });
          }
        }
      }
    });
  });
}

exports.clickchic = function(req, res) {
  log.info("PUT - /api/v1/product/like - params token: " + req.body.token + "params seller_id: " + req.body.seller_id);

  // Input validations
  // Needs one params
  if (!req.body.token || !req.body.seller_id) {
    return res.send({ status: "error", error_msg: "You need more params! Remember: token, seller_id." });
  };

  return User.findOne( { token: req.body.token }, function(err, user) {
    if(!user) {
      res.statusCode = 200;
      return res.send({ status: "error", error_msg: 'Not user' });
    }

    User.findById(req.body.seller_id, function(errSeller, seller) {
      if(!seller) {
        res.statusCode = 404;
        return res.send({ status: "error", error_msg: 'Not found seller with this id' });
      }

      var existsClickChicForSeller = false;
      seller.clickchics.forEach(function(element, index, array){
        if (element.user_id.equals(user._id)) { 
          existsClickChicForSeller = true;
          if (index > -1) {
            seller.clickchics.splice(index, 1);
          }
        };
      });

      // Fields for update
      if (!existsClickChicForSeller) {
        seller.clickchics.push({ user_id: user._id, username: user.userName });
        seller.clickchic_count = seller.clickchic_count + 1;
      } else {
        seller.clickchic_count = seller.clickchic_count - 1;
      }
      seller.modified_at = new Date;

      seller.save(function(err) {
        if(!err) {
          res.statusCode = 200;
          res.send({ status: 'ok', seller:seller });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ status: "error", error_msg: 'Validation error' });
          } else {
            res.statusCode = 500;
            if (err.code == 11000) {
              log.error('Duplicate key');
              res.send({ status: "error", error_msg: 'Duplicate key' });
            } else {
              log.error('Internal error(%d): %s',res.statusCode,err.message);
              res.send({ status: "error", error_msg: 'Server error' });
            }
          }
        }
      });
    });
  });
 };


////////////// WEB /////////////////
// POST - /api/v1/shop 
exports.shop = function(req, res) {
  log.info('POST - /api/v1/shop --> Show user shop');
  log.info('Params - token: ' + req.body.token);

  // Input validations
  // Needs one params
  if (req.body.token == null) {
    return res.send({ status: "error", error_msg: "You need more params! Remember: token" });
  };
  
  var query  = { token: req.body.token };
  var dict = {};

  User.findOne(query, function(err, user) {
    if (user == null) {
      res.statusCode = 200;
      log.info('Status(%d): %s',res.statusCode, "No find User");        
      return res.send({"status": "error", error_msg: "Not user."});
    }
    if(!err) {
      if (user.role == "crafter") {
        res.statusCode = 200;
        res.send( { status: "error", error_msg: "You need be a seller."} );
      }
      else {
        if (user.role == "seller") {
          dict["email"] = user.email;
          dict["id"] = user.id;
          dict["username"] = user.userName;
          dict["clickchick_count"] = user.clickchick_count;
          dict["clickchics"] = user.clickchicks;
          dict["address"] = user.shop.address;
          dict["web"] = user.web;
          dict["twitter"] = user.twitter.name;
          dict["products_count"] = user.products_count;
          dict["lat"] = user.shop.lat;
          dict["lon"] = user.shop.lon;

          var arrayCategories = [];
          Category.find(function(err, categories) {
            console.log("AQUI: " + categories);
            if (categories.length == 0) {
              res.statusCode = 200;
              log.info('Status(%d): %s',res.statusCode, "No find categories. :(");        
              return res.send( { status: "error", error_msg: "Not categories." });
            }
            if(!err) {
              arrayCategories = categories;
            } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s',res.statusCode,err.message);
              res.send({ status: "error", error_msg: 'Server error' });
            }
          });

          var query = {};
          query["seller_id"] = user._id;
          var arrayProducts = [];
          Product.find(query).sort({'created_at' : -1}).limit(30).exec(function(err, products) {
            if (products.length == 0) {
              res.statusCode = 200;
              log.info('Status(%d): %s',res.statusCode, "No find products. :(");        
              return res.send( { status: "error", error_msg: "Not products." });
            }
            if(!err) {
              arrayProducts = products;
            } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s',res.statusCode,err.message);
              res.send({ status: "error", error_msg: 'Server error' });
            }
          });

          Product.find(query).sort({'views_count' : -1}).limit(3).exec(function(err, products2) {
            if (products2.length == 0) {
              res.statusCode = 200;
              log.info('Status(%d): %s',res.statusCode, "No find products2. :(");        
              return res.send( { status: "error", error_msg: "Not products2." });
            }
            if(!err) {
              res.statusCode = 200;
              res.send( { status: "ok", user: dict, products: arrayProducts, categories: arrayCategories, top: products2 } );
            } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s',res.statusCode,err.message);
              res.send({ status: "error", error_msg: 'Server error' });
            }
          });

        } else {

        }
      }
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      res.send({ error: 'Server error' });
    }
  });
}




