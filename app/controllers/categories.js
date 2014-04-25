
  var Category = require('../models/category.js');
  var log     = require('../../libs/log')(module);

  //GET - /categories --> Return all categories in the DB
  exports.index = function(req, res) {
    log.info("GET - /categories");
  	Category.find(function(err, categories) {
      if (categories.length == 0) {
        res.statusCode = 204;
        log.info('Status(%d): %s',res.statusCode, "No find products");        
        return res.json([]);
      }
  		if(!err) {
  			res.json({ "categories" : categories });
  		} else {
        res.statusCode = 500;
  			log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.send({ error: 'Server error' });
  		}
  	});
  };
  
  // POST - /category --> Insert a new Category in the DB
  // Params - name_es, name_en, name_cat
  exports.create = function(req, res) {
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
        res.send({ id: category.id});
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



