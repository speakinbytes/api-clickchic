var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Images = require('./image.js')


var Product = new Schema({
  model:          { type: String },
  description:    { type: String },
  seller_id:      { type: Number },
  category_id:    { type: Number },
  subcategory_id: { type: Number },
  price:          { type: Number },
  images:         [Images],
  colour:         { type: String,
                    enum: ['blue', 'red', 'green', 'yellow'] },
  units:          { type: Number },
  gender:         { type: String,
                    enum: ['H', 'M'] },
  size:           { type: String, 
                    enum: ['S', 'M', 'L', 'XL', 'XXL'] },
  created_at:     { type: Date, default: Date.now },
  modified_at:    { type: Date } 
});

/*
* Presence validations
*/
Product.path('model').required(true);
Product.path('description').required(true);
Product.path('seller_id').required(true);
Product.path('category_id').required(true);
// Product.path('subcategory').required(true);
Product.path('price').required(true);
Product.path('units').required(true);

/*
* Uniquesness validations
*/
// Product.schema.path('model').validate(function (value, respond) {                                                                                           
//     User.findOne({ model: value }, function (err, user) {                                                                                                
//         if(user) respond(false);                                                                                                                         
//     });                                                                                                                                                  
// }, 'This model is already registered');

/*
* Custom Validation
*/
// Product.path('model').validate(function (v) {
//     return ((v != "") && (v != null));
// });

module.exports = mongoose.model('Product', Product);