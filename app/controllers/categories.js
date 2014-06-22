// This document is divided in two sections:
// -> Api routes
// -> Web routes

  var Category = require('../models/category.js');
  var log     = require('../../libs/log')(module);
  var User    = require('../models/user.js');
//
// API ROUTES
//

  //GET - /api/v1/categories --> Return all categories in the DB
  exports.index = function(req, res) {
    log.info("GET - /api/v1/categories");
  	Category.find(function(err, categories) {
      if (categories.length == 0) {
        res.statusCode = 204;
        log.info('Status(%d): %s',res.statusCode, "No find categories");        
        return res.send( { status: "error", error_msg: "No find categories" });
      }
  		if(!err) {
  			res.json({ status: "ok", "categories" : categories });
  		} else {
        res.statusCode = 500;
  			log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.send({ status: "error", error: 'Server error' });
  		}
  	});
  };
  
  // POST - /api/v1/category --> Insert a new Category in the DB
  // Params - name_es, name_en, name_cat
  exports.create = function(req, res) {
    log.info('POST - /api/v1/category --> Creating category');
    log.info('Body - name_es: %s, name_en: %s, name_cat: %s', 
                       req.body.name_es, req.body.name_en, req.body.name_cat );
    
    // Needs all params
    if (!req.body.token|| 
        !req.body.name_es || 
        !req.body.name_en) {
      res.statusCode = 200;
      return res.send({ status: "error", error_msg: "You need more inputs! Remember: token, name_es, name_en." });
    };

    var category = new Category({
      name_es:    req.body.name_es,  
      name_en:    req.body.name_en, 
      name_cat:   req.body.name_cat,     
    });

    User.findOne( {token : req.body.token} , function(err, user){
      console.log(user);
      if(!err && user && (user.role == "admin")) {
        category.save(function(err) {
          if(!err) {
            log.info("category created");
            res.statusCode = 201;
            res.send({ status: "ok", category: category });
          } else {
            if(err.name == 'ValidationError') {
              res.statusCode = 400;
              log.error('Validation error(%d): %s',res.statusCode,err.message);
              res.send( { status: "error", error_msg: 'Validation error('+res.statusCode+'): '+err.message });
            } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s',res.statusCode,err.message);
              res.send({ error: 'Server error' });
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

  // DELETE - Delete a Category with specified ID
  exports.deleteCategory = function(req, res, next) {
    log.info("DELETE - /product/:id");
    return Category.findById(req.params.id, function(err, category) {
      if(!category) {
        res.statusCode = 404;
        return res.send({ status: "error", error_msg: 'Not found' });
      }

      User.findOne( {token : req.body.token} , function(err, user){
        if(!err && user && (user.role == "admin")) {
          category.remove(function(err) {
            if(!err) {
              console.log('Removed category');
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


//
// WEB ROUTES
//

//GET - /categories --> Return all categories in the DB
  exports.web_index = function(req, res) {
    log.info("GET - /categories");
    res.render('categories/index.html');
  };
  
  // POST - /category --> Insert a new Category in the DB
  // Params - name_es, name_en, name_cat
  exports.web_create = function(req, res) {
    log.info('POST - /category --> Creating category');
    log.info('Body - name_es: %s, name_en: %s, name_cat: %s', 
                       req.body.name_es, req.body.name_en, req.body.name_cat );
    log.info(req.body[0]);

    var category = new Category({
      name_es:    req.body.name_es,  
      name_en:    req.body.name_en, 
      name_cat:   req.body.name_cat,     
    });

    category.save(function(err) {
      if(!err) {
        log.info("category created");
        res.statusCode = 201;
        res.redirect("/categories");
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