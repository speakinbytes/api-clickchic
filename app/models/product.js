var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Images = require('./image.js')


var Product = new Schema({
  model:          { type: String },
  description:    { type: String },
  seller_id:      {
                    type: Schema.ObjectId,
                    ref: 'User'
                  },
  seller_name:    { type: String },
  seller_shop:    { type: String }, 
  seller_twitter: { type: String }, 
  seller_avatar:  { type: String },  
  category_id:    { type: String },
  subcategory_id: { type: String },
  price:          { type: Number },
  images:         [ String ],
  colour:         { type: String,
                    enum: ['blue', 'red', 'green', 'yellow'] },
  units:          { type: Number },
  gender:         { type: String,
                    enum: ['H', 'M'] },
  size:           { type: String, 
                    enum: ['S', 'M', 'L', 'XL', 'XXL'] },
  views_count:    { type: Number },
  likes_count:    { type: Number },
  likes:          [ {
                      user_id: {type: Schema.ObjectId },
                      username: String
                    }],
  comments:       [ { 
                      user_id: { type: Schema.ObjectId },
                      username: String,
                      comment: String
                    } ],
  comments_count: { type: Number },
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