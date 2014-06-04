// This document is divided in two sections:
// -> Api routes
// -> Web routes

  var Product = require('../models/product.js');
  var log     = require('../../libs/log')(module);
  var crypto  = require('crypto');
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
    log.info("GET - /api/v1/products");
  	Product.find(function(err, products) {
      if (products.length == 0) {
        res.statusCode = 204;
        log.info('Status(%d): %s',res.statusCode, "No find products. :(");        
        return res.send("Prueba");
      }
  		if(!err) {
  			res.send({ "products" : products.toString("utf8") });
  		} else {
        res.statusCode = 500;
  			log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.send({ error: 'Server error' });
  		}
  	});
  };

  // POST - /api/v1/products --> Return all search products in the DB
  exports.searchIndex = function(req, res) {
    log.info("POST - /api/v1/products - search");
    
    if (req.body.seller_id) {
      Product.find({ seller_id: req.body.seller_id }, function(err, products) {
        if (products.length == 0) {
          res.statusCode = 204;
          log.info('Status(%d): %s',res.statusCode, "No find products");        
          return res.send([]);
        }
        if(!err) {
          res.send({ "products" : products });
        } else {
          res.statusCode = 500;
          log.error('Internal error(%d): %s',res.statusCode,err.message);
          res.send({ error: 'Server error' });
        }
      });
    }
  };
  
  // GET - /api/v1/product/{id} --> Return a Product with specified ID
  exports.show = function(req, res) {
    log.info("GET - /api/v1/product/:id");
    Product.findById(req.params.id, function(err, product) {
      if(!product) {
        res.statusCode = 404;
        log.info('Status(%d): %s',res.statusCode, "No find product"); 
        return res.send({ error: 'Not found' });
      }
      if(!err) {
        res.statusCode = 200;
        res.send({ product:product });
      } else {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.send({ error: 'Server error' });
      }
    });
  };

  
  // POST - /api/v1/product --> Insert a new Product in the DB
  // Params - model, description, seller_id, category_id, subcategory_id, price, units, colour, gender, size
  exports.create = function(req, res) {
    log.info('POST - /api/v1/product --> Creating product');
    log.info('Params - model: %s, description: %s, seller_id: %s, category_id: %s, subcategory_id: %s, price: %s, units: %s, colour: %s, gender: %s, size: %s', 
                       req.body.model, req.body.description, req.body.seller_id, 
                       req.body.category_id, req.body.subcategory_id, req.body.price, 
                       req.body.units, req.body.colour, req.body.gender, req.body.size );

    // var userId = req.user.id;
    // console.log("--->" + userId);

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
      size:           req.body.size
    });

    if (req.body.images instanceof Array) { 
      console.log("ARRAY");
      req.body.images.forEach(function(element, index, array){
        product.images.push( element );
      });
    }
    else
    {
      product.images.push( req.body.images );      
    }    

    product.save(function(err) {
      if(!err) {
        log.info("product created");
        res.statusCode = 201;
        res.send({ id: product.id});
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
    return Product.findById(req.params.id, function(err, product) {
      if(!product) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      product.remove(function(err) {
        if(!err) {
          console.log('Removed product');
          res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          res.send({ error: 'Server error' });
        }
      })
    });
  }




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

