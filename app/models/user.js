var mongoose    = require('mongoose');
var crypto      = require('crypto');
var authTypes   = ['twitter', 'facebook', 'google'];
var _           = require('underscore');

var UserSchema = mongoose.Schema({
    role:       { type: String,
                    enum: ['admin', 'user', 'seller'] }, 
    name:       String,
    lastName:   String,
    userName:   String, 
    email:      { type: String, unique: true },
    provider:   String, 
    photo:      String, 
    salt:       String,
    hashed_password: String,  
    token:      String,   
    clickchick_count:  { type: Number },
    clickchics: [ {
                    user_id: {type: mongoose.Schema.ObjectId },
                    username: String
                }],
    shop:       {
                    address: String, 
                    name: String,
                    lat: Number,
                    lon: Number
                },
    web:        String,
    products_count: Number,
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
    createdAt    : {type: Date, default: Date.now},
    modified_at:   { type: Date } 
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    console.log("Aqui virtual");
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};
UserSchema.path('userName').required(true);
UserSchema.path('email').required(true);
UserSchema.path('hashed_password').required(true);


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1)
        next(new Error('Invalid password'));
    else
        next();
});

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        console.log("Authenticate");
        console.log(this.hashed_password);
        console.log(this.encryptPassword(plainText));
        if (this.encryptPassword(plainText) == this.hashed_password) {return true;};

        return false;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        console.log("Aqui encryptPassword: " + password);
        if (!password) return '';
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

// UserSchema.path('userName').required(true);
// UserSchema.path('email').required(true);
// UserSchema.path('hashed_password').required(true);
// UserSchema.path('role').required(true);
// UserSchema.path('email').index({ unique: true });

module.exports = mongoose.model('User', UserSchema);
