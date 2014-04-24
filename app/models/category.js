var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Category = new Schema({
  name_es:      { type: String },
  name_en:      { type: String },
  name_cat:     { type: String },
  created_at:   { type: Date, default: Date.now },
  modified_at:  { type: Date } 
});

module.exports = mongoose.model('Category', Category);