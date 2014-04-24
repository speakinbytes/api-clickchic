  var Product = require('../models/product.js');
  var log     = require('../../libs/log')(module);
  // var WasHot = require('../models/washot.js');
  // var redis  = require("redis"),
  //     client = redis.createClient();
  // var ttl    = 60;

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

  //GET - /products --> Return all products in the DB
  exports.index = function(req, res) {
    log.info("GET - /products");
  	Product.find(function(err, products) {
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
  };

  // POST - /products --> Return all search products in the DB
  exports.searchIndex = function(req, res) {
    log.info("GET - /products");
    
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
  

  // GET - /product/{id} --> Return a Product with specified ID
  exports.show = function(req, res) {
    log.info("GET - /tshirt/:id");
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

  // POST - /product --> Insert a new Product in the DB
  // Params - model, description, seller_id, category_id, subcategory_id, price, units, colour, gender, size
  exports.create = function(req, res) {
    log.info('POST - /product --> Creating product');
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

  // //DELETE - Delete a Tshirt with specified ID
  // deleteTshirt = function(req, res) {
  //   log.info("DELETE - /tshirt/:id");
  //   return Tshirt.findById(req.params.id, function(err, tshirt) {
  //     if(!tshirt) {
  //       res.statusCode = 404;
  //       return res.send({ error: 'Not found' });
  //     }

  //     tshirt.remove(function(err) {
  //       if(!err) {
  //         console.log('Removed tshirt');
  //         res.send({ status: 'OK' });
  //       } else {
  //         res.statusCode = 500;
  //         console.log('Internal error(%d): %s',res.statusCode,err.message);
  //         res.send({ error: 'Server error' });
  //       }
  //     })
  //   });
  // }

  // hot = function(req, res){
  //   log.info("GET - /hots");

  //   client.keys("hot.*", function (err, replies){
  //     if (replies.length == 0) {
  //       res.statusCode = 404;
  //       return res.send({ error: 'Not hot tshirts now' });
  //     } 
  //     if (!err) {
  //       async = require("async");
 
  //       // Array to hold async tasks
  //       var asyncTasks = [];
  //       var hotTshirts = [];
         
  //       // Loop through some items
  //       replies.forEach(function(item){
  //         // We don't actually execute the async thing here
  //         // We push a function containing it on to an array of "tasks"
  //         asyncTasks.push(function(callback){
  //           // Call an async function (often a save() to MongoDB)
  //           Tshirt.findById(item.substring(4), function (err, tshirt){
  //               if (err) {
  //                 console.log("Hot Tshirt Not Found");
  //                 res.statusCode = 500;
  //                 console.log('Internal error(%d): %s',res.statusCode,err.message);
  //                 return res.send({ error: 'Server error' });
  //               }
  //               else {
  //                 hotTshirts.push(tshirt);
  //                 console.log("hotTshirts add");
  //               }
  //             });
  //             // Async call is done, alert via callback
  //             callback();
  //           });
  //         });
        
         
  //       // Note: At this point, nothing has been executed,
  //       // we just pushed all the async tasks into an array
         
  //       // To move beyond the iteration example, let's add
  //       // another (different) async task for proof of concept
  //       asyncTasks.push(function(callback){
  //         // Set a timeout for 3 seconds
  //         setTimeout(function(){
  //           // It's been 0.5 seconds, alert via callback
  //           callback();
  //         }, 500);
  //       });
         
  //       // Now we have an array of functions, each containing an async task
  //       // Execute all async tasks in the asyncTasks array
  //       async.parallel(asyncTasks, function(){
  //         // All tasks are done now
  //         //doSomethingOnceAllAreDone();
  //         console.log(hotTshirts);
  //         res.send(hotTshirts);
  //       });

  //     } 
  //     else {
  //       res.statusCode = 500;
  //       console.log('Internal error(%d): %s',res.statusCode,err.message);
  //       res.send({ error: 'Server error' });
  //     }
  //   });
  // }

  // washot = function(req, res) {
  //   log.info("GET - /washot");
  //   var date = new Date();
  //   if (((req.params.monthstart < 1) || (req.params.monthstart > 12)) || ((req.params.monthend < 1) || (req.params.monthend > 12)))
  //   {
  //     console.log("Incorrect month");
  //     res.statusCode = 404;
  //     return res.send("Incorrect month");
  //   }    
  //   if (((req.params.daystart < 1) || (req.params.daystart > 31)) || ((req.params.dayend < 1) || (req.params.dayend > 31)))
  //   {
  //     console.log("Incorrect day");
  //     res.statusCode = 404;
  //     return res.send("Incorrect day");
  //   }
  //   if (((req.params.monthstart == 4) || (req.params.monthstart == 6) || (req.params.monthstart == 9) || (req.params.monthstart == 11)) 
  //        && (req.params.daystart > 30))
  //   {
  //     console.log("Incorrect day");
  //     res.statusCode = 404;
  //     return res.send("Incorrect day");
  //   }
  //   if (((req.params.monthend == 4) || (req.params.monthend == 6) || (req.params.monthend == 9) || (req.params.monthend == 11)) 
  //        && (req.params.dayend > 30))
  //   {
  //     console.log("Incorrect day");
  //     res.statusCode = 404;
  //     return res.send("Incorrect day");
  //   }
  //   if((req.params.monthstart == 2) && 
  //      (((req.params.yearstart % 400) == 0) || ((req.params.yearstart % 4) == 0)) && ((req.params.yearstart % 100) != 0) 
  //      && (req.params.daystart > 29))
  //   {
  //     console.log("Incorrect day");
  //     res.statusCode = 404;
  //     return res.send("Incorrect day");
  //   }
  //   if((req.params.monthend == 2) && 
  //      (((req.params.yearend % 400) == 0) || ((req.params.yearend % 4) == 0)) && ((req.params.yearend % 100) != 0) 
  //      && (req.params.dayend > 29))
  //   {
  //     console.log("Incorrect day");
  //     res.statusCode = 404;
  //     return res.send("Incorrect day");
  //   }
  //   if((req.params.monthstart == 2) && ((req.params.yearstart % 100) == 0) && (req.params.daystart > 29)){
  //     console.log("Incorrect day");
  //     res.statusCode = 404;
  //     return res.send("Incorrect day");
  //   }
  //   if((req.params.monthend == 2) && ((req.params.yearend % 100) == 0) && (req.params.dayend > 29)){
  //     console.log("Incorrect day");
  //     res.statusCode = 404;
  //     return res.send("Incorrect day");
  //   }
  //   if ((req.params.yearstart < 2000) || (req.params.yearend < 2000)) {
  //     console.log("Year should be bigger than 2000");
  //     res.statusCode = 404;
  //     return res.send("Year should be bigger than 2000");
  //   }
  //   if (req.params.yearend < req.params.yearstart) {
  //     console.log("Year end shouldn't be smaller than year start");
  //     res.statusCode = 404;
  //     return res.send("Year end shouldn't be smaller than year start");
  //   } 
  //   else if ((req.params.yearstart == req.params.yearend) && (req.params.monthend < req.params.monthstart)) {
  //     console.log("Month end shouldn't be smaller than month start");
  //     res.statusCode = 404;
  //     return res.send("Month end shouldn't be smaller than month start");
  //   }
  //   else if ((req.params.monthstart == req.params.monthend) && (req.params.dayend < req.params.daystart)) {
  //     console.log("Day end shouldn't be smaller than day start");
  //     res.statusCode = 404;
  //     return res.send("Day end shouldn't be smaller than day start");
  //   }

  //   var dateStart = new Date(req.params.yearstart, req.params.monthstart, req.params.daystart);
  //   var dateEnd = new Date(req.params.yearend, req.params.monthend, req.params.dayend);

  //   WasHot.find({created : {"$gte" : dateStart, "$lt" : dateEnd }}, function (err, washots) {
  //     if (washots.length == 0) {
  //       console.log("No find washots");
  //       res.statusCode = 404;
  //       return res.send("No find washots");
  //     }
  //     if(!err) {
  //       res.send(washots);
  //     } else {
  //       res.statusCode = 500;
  //       console.log('Internal error(%d): %s',res.statusCode,err.message);
  //       res.send({ error: 'Server error' });
  //     }
  //   });
  // };




