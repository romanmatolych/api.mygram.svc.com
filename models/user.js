const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Salt length to generate
const SALT_ROUNDS = 10;

// Create a schema that defines the shape of users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {type: String, required: true},
    password: {type: String, required: true}
});

userSchema
    .virtual('fullName')
    .get(function () {
        return `${this.firstName} ${this.lastName}`;
    });

// Relative to the root path of the user
userSchema
    .virtual('url')
    .get(function () {
        return `/users/${this._id}`;
    });

// Generates a hash for the given password and then 
// calls the callback with an error if any and the hash
userSchema.statics.generateHash = function(password, callback) {
    bcrypt.hash(password, SALT_ROUNDS, callback);
};

// Compares the given password to the user's pass and
// calls the callback with an error if any and the result
userSchema.methods.checkPassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
};

module.exports = mongoose.model('User', userSchema);