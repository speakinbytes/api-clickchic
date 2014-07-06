// This document is divided in two sections:
// -> Api routes
// -> Web routes

  var Product = require('../models/product.js');
  var log     = require('../../libs/log')(module);
  var crypto  = require('crypto');
  var User    = require('../models/user.js');
  // var WasHot = require('../models/washot.js');
  // var redis  = require("redis"),
  //     client = redis.createClient();
  // var ttl    = 60;

//
// API ROUTES
//

  /**
  * Find article by id
  */
  exports.product = function(req, res, next, id) {
    var User = mongoose.model('User');

    Product.load(id, function(err, product) {
        if (err) return next(err);
        if (!product) return next(new Error('Failed to load product ' + id));
        req.product = product;
        next();
    });
  };

  //GET - /api/v1/products --> Return all products in the DB
  exports.index = function(req, res) {
    log.info("POST - /api/v1/products");

    log.info("Params. token: " + req.body.token +
                      "seller_id: " + req.body.seller_id +
                      "featured: " + req.body.featured +
                      "category_id: " + req.body.category_id +
                      "last: " + req.body.last);

    if (!req.body.token && !req.body.seller_id && !req.body.category_id && !req.body.featured && !req.body.last) {
      res.statusCode = 200;
      return res.send({ status: "error", error_msg: 'Need params. Remember: token or seller_id or category_id or featured or last' });
    };

    if (req.body.token && req.body.seller_id) {
      res.statusCode = 200;
      res.send( { status: "error", error_msg: "send only toker or seller_id, not both."} );
    };

    var query = {};
    if ((req.body.token || req.body.seller_id) && !req.body.category_id && !req.body.featured) {
      console.log("Dentro de token sin category y sin featured");
      var userQuery;
      if (req.body.token) { userQuery = { token: req.body.token }; }
      if (req.body.seller_id) { userQuery = { _id: req.body.seller_id }; };
      User.findOne( userQuery , function(err, user){
        if(!err && user) {
          query["seller_id"] = user._id;
          Product.find(query, function(err, products) {
            if (products.length == 0) {
              res.statusCode = 200;
              log.info('Status(%d): %s',res.statusCode, "No find products. :(");        
              return res.send( { status: "error", error_msg: "Not products." });
            }
            if(!err) {
              res.send({ status: "ok", "products" : products });
            } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s',res.statusCode,err.message);
              res.send({ status: "error", error_msg: 'Server error' });
            }
          });
        }
        else {
          res.statusCode = 200;
          res.send( { status: "error", error_msg: "Not user."} );
        }
      });
    };
    
    if (req.body.category_id && !req.body.token && !req.body.seller_id) { 
      log.info("Dentro  de category");
      query["category_id"] = req.body.category_id;
    	Product.find(query, function(err, products) {
        if (products.length == 0) {
          res.statusCode = 200;
          log.info('Status(%d): %s',res.statusCode, "No find products. :(");        
          return res.send( { status: "error", error_msg: "Not products." });
        }
    		if(!err) {
    			res.send({ status: "ok", "products" : products });
    		} else {
          res.statusCode = 500;
    			log.error('Internal error(%d): %s',res.statusCode,err.message);
          res.send({ status: "error", error_msg: 'Server error' });
    		}
    	});
    };

    if (req.body.featured && !req.body.token && !req.body.seller_id) {
      log.info("Dentro de featured");
      Product.find().sort({'views_count' : -1}).limit(30).exec( function(err, products) {
        if (products.length == 0) {
          res.statusCode = 200;
          log.info('Status(%d): %s',res.statusCode, "No find products with featured. :(");        
          return res.send( { status: "error", error_msg: "Not products." });
        }
        if(!err) {
          res.send({ status: "ok", "products" : products });
        } else {
          res.statusCode = 500;
          log.error('Internal error(%d): %s',res.statusCode,err.message);
          res.send({ status: "error", error_msg: 'Server error' });
        }
      });
    };

    if (req.body.last && !req.body.token && !req.body.seller_id) {
      log.info("Dentro de last");
      Product.find().sort({'created_at' : -1}).limit(30).exec( function(err, products) {
        if (products.length == 0) {
          res.statusCode = 200;
          log.info('Status(%d): %s',res.statusCode, "No find products with featured. :(");        
          return res.send( { status: "error", error_msg: "Not products." });
        }
        if(!err) {
          res.send({ status: "ok", "products" : products });
        } else {
          res.statusCode = 500;
          log.error('Internal error(%d): %s',res.statusCode,err.message);
          res.send({ status: "error", error_msg: 'Server error' });
        }
      });
    };

    // token and category_id
    if (req.body.category_id && req.body.token && !req.body.seller_id) { 
      log.info("Dentro  de token and category");
      
      User.findOne( {token: req.body.token} , function(err, user){
        if(!err && user) {
          query["seller_id"] = user._id;
          Product.find(query).where("category_id").equals(req.body.category_id).exec(function(err, products) {
            if (products.length == 0) {
              res.statusCode = 200;
              log.info('Status(%d): %s',res.statusCode, "No find products. :(");        
              return res.send( { status: "error", error_msg: "Not products." });
            }
            if(!err) {
              res.send({ status: "ok", "products" : products });
            } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s',res.statusCode,err.message);
              res.send({ status: "error", error_msg: 'Server error' });
            }
          });
        }
        else {
          res.statusCode = 200;
          res.send( { status: "error", error_msg: "Not user."} );
        }
      });
    };

    // token and featured
    if (req.body.featured && req.body.token && !req.body.seller_id) {
      log.info("Dentro de token and featured");

      User.findOne( {token: req.body.token} , function(err, user){
        if(!err && user) {
          query["seller_id"] = user._id;
          Product.find({ "seller_id" : user._id }).limit(30).sort( {'views_count' : -1 }).exec(function(err, products) {
            if (products.length == 0) {
              res.statusCode = 200;
              log.info('Status(%d): %s',res.statusCode, "No find products. :(");        
              return res.send( { status: "error", error_msg: "Not products." });
            }
            if(!err) {
              res.send({ status: "ok", "products" : products });
            } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s',res.statusCode,err.message);
              res.send({ status: "error", error_msg: 'Server error' });
            }
          });
        }
        else {
          res.statusCode = 200;
          res.send( { status: "error", error_msg: "Not user."} );
        }
      });
    };

  };
  
  // GET - /api/v1/product/{id} --> Return a Product with specified ID
  exports.showUser = function(req, res) {
    log.info("POST - /api/v1/product/:id");

    // if (!req.body.product_id || req.body.product_id == "") {
    //   return res.send({status: "error", error_msg: "Need product_id"});
    // }

    Product.findById(req.params.id, function(err, product) {
      if(!product) {
        res.statusCode = 200;
        log.info('Status(%d): %s',res.statusCode, "No find product"); 
        return res.send({ status: "error", error_msg: 'Not found' });
      }
      if(!err) {

        product.views_count = product.views_count + 1;
        product.save(function(err) {
          if(!err) {
            console.log("-------> Body; " + req.body.token + " params: " + req.params.token);
            if (req.body.token && req.body.token != "") {
              User.findOne( {token : req.body.token} , function(err, user){
                if(!err && user) {
                  var existLikeByThisUser = false;
                  product.likes.forEach(function(element, index, array){
                    if (element.user_id.equals(user._id)) { 
                      existLikeByThisUser = true;
                      if (index > -1) {
                        product.likes.splice(index, 1);
                      }
                    };
                  });

                  // Fields for update
                  if (!existLikeByThisUser) {
                    res.statusCode = 200;
                    res.send({ status: "ok", product:product, like_me: "0" });
                  } else {
                    res.statusCode = 200;
                    res.send({ status: "ok", product:product, like_me: "1" });
                  }
                } else {
                  log.error("Show product with incorrect token");
                  res.statusCode = 200;
                  res.send({ status: "error", error_msg: "Problems with your token."});
                }

              });
            } else {
              res.statusCode = 200;
              res.send({ status: "ok", product:product });
            }            
          } else {
            res.statusCode = 200;
            res.send( { status: "error", error_msg: "Imposible show product now! Try again!"} );
          }
        });
      } else {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.send({ status: "error", error_msg: 'Server error' });
      }
    });
  };

  exports.show = function(req, res) {
    log.info("GET - /api/v1/product/:id");

    Product.findById(req.params.id, function(err, product) {
      if(!product) {
        res.statusCode = 200;
        log.info('Status(%d): %s',res.statusCode, "No find product"); 
        return res.send({ status: "error", error_msg: 'Not found' });
      }
      if(!err) {

        product.views_count = product.views_count + 1;
        product.save(function(err) {
          if(!err) {
            res.statusCode = 200;
            res.send( { status: "ok", product: product } );
          } else {
            res.statusCode = 200;
            res.send( { status: "error", error_msg: "Imposible show product now! Try again!"} );
          }
        });
      } else {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.send({ status: "error", error_msg: 'Server error' });
      }
    });
  };
  
  // POST - /api/v1/product --> Insert a new Product in the DB
  // Params - model, description, seller_id, category_id, subcategory_id, price, units, colour, gender, size
  exports.create = function(req, res) {
    log.info('POST - /api/v1/product --> Creating product by user token: ' + req.body.token);
    log.info('Params - model: %s, description: %s, seller_id: %s, category_id: %s, subcategory_id: %s, price: %s, units: %s, colour: %s, gender: %s, size: %s', 
                       req.body.model, req.body.description, req.body.seller_id, 
                       req.body.category_id, req.body.subcategory_id, req.body.price, 
                       req.body.units, req.body.colour, req.body.gender, req.body.size );

    // Needs all params
    if (!req.body.token|| 
        !req.body.model || 
        !req.body.description || 
        !req.body.price || 
        !req.body.category_id ||
        !req.body.units ) {
      res.statusCode = 200;
      return res.send({ status: "error", error_msg: "You need more inputs! Remember: token, model, description, price, category_id, units." });
    };


    User.findOne( {token : req.body.token} , function(err, user){
      if(!err && user && user.role == "seller") {
        var product = new Product();

        product.seller_id = user;
        if (user.userName && user.userName != "") { 
          product.seller_name = user.userName;
        };

        if (user.twitter.name && user.twitter.name != "") {
          product.seller_twitter = user.twitter.name;
        } else {
          product.seller_twitter = "@clickchic";
        }
        
        if (user.photo && user.photo != "") {
          product.seller_avatar = user.photo;
        } else {
          product.seller_avatar = "https://s3.amazonaws.com/api-clickchic-img/mini_avatar.png";
        }

        product.comments_count = 0;
        product.views_count = 0;
        product.likes_count = 0;

        // Note: Look for put comments or likes
        // product.comments.push({ user_id: "53a68ebc6be182a069000001", username: "Pepe", comment: "Esto es un comentario" });

        if (req.body.model != null) product.model = req.body.model;      
        if (req.body.description != null) product.description = req.body.description;
        if (req.body.category_id != null) product.category_id = req.body.category_id;
        if (req.body.subcategory_id != null) product.subcategory_id = req.body.subcategory_id;
        if (req.body.price != null) product.price = req.body.price;
        if (req.body.units != null) product.units = req.body.units; 
        if (req.body.size != null) product.size  = req.body.size;
        if (req.body.colour != null) product.colour = req.body.colour;
        if (req.body.gender != null) product.gender = req.body.gender;

        if (req.body.images != null) {
          if (req.body.images instanceof Array) {
            req.body.images.forEach(function(element, index, array){
              product.images.push( element );
            });
          }
          else
          {
            product.images.push( req.body.images );      
          }    
        }

        product.save(function(err_product) {
          if(!err_product) {
            log.info("product created");

            user.products_count = user.products_count + 1;

            user.save(function(err_user) {
              if(!err_user) {
                log.info("user num_product");
                res.statusCode = 201;
                res.send({ status: "ok", product: product});
              } else {
                if(err_user.name == 'ValidationError') {
                  res.statusCode = 400;
                  log.error('Validation error(%d): %s',res.statusCode,err_user.message);
                  res.send('Validation error('+res.statusCode+'): '+err_user.message);
                } else {
                  res.statusCode = 500;
                  log.error('Internal error(%d): %s',res.statusCode,err_user.message);
                  res.send({ status: "error", error_msg: 'Server error' });
                }
              }
            });
          } else {
            if(err_product.name == 'ValidationError') {
              res.statusCode = 400;
              log.error('Validation error(%d): %s',res.statusCode,err_product.message);
              res.send('Validation error('+res.statusCode+'): '+err_product.message);
            } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s',res.statusCode,err_product.message);
              res.send({ status: "error", error_msg: 'Server error' });
            }
          }
        });
      } else {
        log.error("Invalid user");
        res.statusCode = 200;
        res.send( { status: "error", error_msg: "Invalid user"} );
      }
    });
  };

  // //PUT - Update a register already exists
  // updateTshirt = function(req, res) {
  //   log.info("PUT - /tshirt/:id");
  //   console.log(req.body);
  //   return Tshirt.findById(req.params.id, function(err, tshirt) {
  //     if(!tshirt) {
  //       res.statusCode = 404;
  //       return res.send({ error: 'Not found' });
  //     }

  //     if (req.body.model != null) tshirt.model = req.body.model;
  //     if (req.body.price != null) tshirt.price = req.body.price;
  //     if (req.body.images != null) tshirt.images = req.body.images; 
  //     if (req.body.style != null) tshirt.style = req.body.style;
  //     if (req.body.size != null) tshirt.size  = req.body.size;
  //     if (req.body.colour != null) tshirt.colour = req.body.colour;
  //     if (req.body.summary != null) tshirt.summary = req.body.summary;

  //     tshirt.save(function(err) {
  //       if(!err) {
  //         console.log('Updated');
  //         res.send({ status: 'OK', tshirt:tshirt });
  //       } else {
  //         if(err.name == 'ValidationError') {
  //           res.statusCode = 400;
  //           res.send({ error: 'Validation error' });
  //         } else {
  //           res.statusCode = 500;
  //           res.send({ error: 'Server error' });
  //         }
  //         console.log('Internal error(%d): %s',res.statusCode,err.message);
  //       }
  //     });
  //   });
  // }

  // DELETE - Delete a Product with specified ID
  exports.deleteProduct = function(req, res, next) {
    log.info("DELETE - /product/:id");

    // Needs all params
    if (!req.body.token) {
      res.statusCode = 200;
      return res.send({ status: "error", error_msg: "You need more inputs! Remember: token." });
    };

    return Product.findById(req.params.id, function(err, product) {
      if(!product) {
        res.statusCode = 404;
        return res.send({ status: "error", error_msg: 'Not found product with this id' });
      }

      User.findOne( {token : req.body.token} , function(err, user){
        if(!err && user && (user.role == "seller") && product.seller_id.equals(user._id)) {
          product.remove(function(err) {
            if(!err) {
              console.log('Removed product');
              res.send({ status: 'ok' });
            } else {
              res.statusCode = 500;
              console.log('Internal error(%d): %s',res.statusCode,err.message);
              res.send({ status: "error", error_msg: 'Server error' });
            }
          });
        } else {
          log.error("Invalid user");
          res.statusCode = 200;
          res.send( { status: "error", error_msg: "Invalid user"} );
        }
      });
    });
  }

 exports.newComment = function(req, res) {
  log.info("PUT - /api/v1/product/comment - params token: " + req.body.token + "params product_id: " + req.body.product_id);

  // Input validations
  // Needs one params
  if (!req.body.token || !req.params.id || !req.body.comment) {
    return res.send({ status: "error", error_msg: "You need more params! Remember: token (body), product_id (param) and comment (body)." });
  };

  return User.findOne( { token: req.body.token }, function(err, user) {
    if(!user) {
      res.statusCode = 200;
      return res.send({ status: "error", error_msg: 'Not user' });
    }

    Product.findById(req.params.id, function(err, product) {
      if(!product) {
        res.statusCode = 404;
        return res.send({ status: "error", error_msg: 'Not found product with this id' });
      }

      // Fields for update
      product.modified_at = new Date;
      product.comments.push({ user_id: user._id, username: user.userName, comment: req.body.comment });
      product.comments_count = product.comments_count + 1;

      product.save(function(err) {
        if(!err) {
          res.statusCode = 200;
          res.send({ status: 'ok', product:product });
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

exports.changeLike = function(req, res) {
  log.info("PUT - /api/v1/product/like - params token: " + req.body.token + "params product_id: " + req.body.product_id);

  // Input validations
  // Needs one params
  if (!req.body.token || !req.params.id) {
    return res.send({ status: "error", error_msg: "You need more params! Remember: token (body), product_id (params)." });
  };

  return User.findOne( { token: req.body.token }, function(err, user) {
    if(!user) {
      res.statusCode = 200;
      return res.send({ status: "error", error_msg: 'Not user' });
    }

    Product.findById(req.params.id, function(err, product) {
      if(!product) {
        res.statusCode = 404;
        return res.send({ status: "error", error_msg: 'Not found product with this id' });
      }

      var existLikeByThisUser = false;
      product.likes.forEach(function(element, index, array){
        console.log("Element: " + element + " index: " + index);
        if (element.user_id.equals(user._id)) { 
          existLikeByThisUser = true;
          if (index > -1) {
            product.likes.splice(index, 1);
          }
        };
      });

      // Fields for update
      if (!existLikeByThisUser) {
        console.log("Exist in array: " + existLikeByThisUser);
        product.likes.push({ user_id: user._id, username: user.userName });
        product.likes_count = product.likes_count + 1;
      } else {
        product.likes_count = product.likes_count - 1;
      }
      product.modified_at = new Date;

      product.save(function(err) {
        if(!err) {
          res.statusCode = 200;
          res.send({ status: 'ok', product:product });
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


//
// WEB ROUTES
//

  // GET - /products --> Return all products in the DB
  exports.web_index = function(req, res) {
    log.info("GET - /products");
    res.render('products/products.html');
  };

  // GET - /shops --> Return all shops in the DB
  exports.web_shops = function(req, res) {
    log.info("GET - /shops");
    res.render('shops/shops.html');
  };

  // GET - /shop/:id --> Return all shops in the DB
  exports.web_shop = function(req, res) {
    log.info("GET - /shop/:id");
    res.render('shops/shop_1.html');
  };

  // GET - /product/new_product
  exports.web_new_product = function(req, res) {
    log.info("GET - /product/new_product");
    res.render('products/create.html');
  };

  exports.sign_s3 = function(req, res) {
    log.info('GET - /product/sign_s3 --> IMAGES upload');

    /*
     * Load the S3 information from the environment variables.
     */
    var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
    var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    var S3_BUCKET = process.env.S3_BUCKET;

    var object_name = req.query.s3_object_name;
    var mime_type = req.query.s3_object_type;

    console.log("object_name" + object_name);
    console.log("mime_type" + mime_type);

    // PENDING -> CHECK FORMATS

    var now = new Date();
    var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
    var amz_headers = "x-amz-acl:public-read";  

    var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+"prod_"+(new Date).getTime()+"_"+object_name;

    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
    signature = encodeURIComponent(signature.trim());
    signature = signature.replace('%2B','+');

    var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+"prod_"+(new Date).getTime()+"_"+object_name;

    var credentials = {
        signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
        url: url
    };
    res.write(JSON.stringify(credentials));
    res.end();

  }

  // POST - /product --> Insert a new Product in the DB
  // Params - model, description, seller_id, category_id, subcategory_id, price, units, colour, gender, size
  exports.web_create = function(req, res) {
    log.info('POST - /api/v1/product --> Creating product');
    log.info('Params - model: %s, description: %s, seller_id: %s, category_id: %s, subcategory_id: %s, price: %s, units: %s, colour: %s, gender: %s, size: %s, image: %s', 
                       req.body.model, req.body.description, req.body.seller_id, 
                       req.body.category_id, req.body.subcategory_id, req.body.price, 
                       req.body.units, req.body.colour, req.body.gender, req.body.size, req.body.image );

    var product = new Product({
      model:          req.body.model,
      description:    req.body.description,
      seller_id:      req.body.seller_id,
      category_id:    req.body.category_id, 
      subcategory_id: req.body.subcategory_id, 
      price:          req.body.price,
      units:          req.body.units, 
      colour:         req.body.colour, 
      gender:         req.body.gender, 
      size:           req.body.size,   
    });

    product.images.push( req.body.image );

    product.save(function(err) {
      if(!err) {
        log.info("product created");
        res.statusCode = 201;
        res.redirect("/products/new");
      } else {
        if(err.name == 'ValidationError') {
          res.statusCode = 400;
          log.error('Validation error(%d): %s',res.statusCode,err.message);
          res.send('Validation error('+res.statusCode+'): '+err.message);
        } else {
          res.statusCode = 500;
          log.error('Internal error(%d): %s',res.statusCode,err.message);
          res.send({ error: 'Server error' });
        }
      }
    });
  };

