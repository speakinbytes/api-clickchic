var mongoose = require('mongoose');
//var authTypes = ['twitter', 'facebook', 'google'];

var UserSchema = mongoose.Schema({
    role:       { type: String,
                    enum: ['admin', 'crafter', 'seller'] }, 
    firstName:  String,
    lastName:   String,
    userName:   String, 
    email:      String,
    provider:   String,
    provider_id:{type: String, unique: true}, 
    photo:      String, 
    salt:       String,
    hashed_password: String,
    facebook:{
        id:       String,
        email:    String,
        name:     String
    },
    twitter:{
        id:       String,
        email:    String,
        name:     String
    },
    google:{
        id:       String,
        email:    String,
        name:     String
    },
    createdAt    : {type: Date, default: Date.now}
});

Product.path('userName').required(true);
Product.path('email').required(true);
Product.path('hashed_password').required(true);


var User = mongoose.model("User", UserSchema);
module.exports = User;
