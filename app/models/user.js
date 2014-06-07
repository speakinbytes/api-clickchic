var mongoose = require('mongoose');
//var authTypes = ['twitter', 'facebook', 'google'];

var UserSchema = mongoose.Schema({
    role:       { type: String,
                    enum: ['admin', 'crafter', 'seller'] }, 
    firstName:  String,
    lastName:   String,
    userName:   String, 
    email:      {type: String},
    provider:   String,
    provider_id:{type: String}, 
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



UserSchema.path('userName').required(true);
UserSchema.path('email').required(true);
UserSchema.path('hashed_password').required(true);
UserSchema.path('role').required(true);
UserSchema.path('email').index({ unique: true });

module.exports = mongoose.model('User', UserSchema);
