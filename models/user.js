const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

var userSchema = new mongoose.Schema({
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

userSchema
    .virtual('url')
    .get(function () {
        return `/users/${this._id}`;
    });

userSchema.statics.generateHash = function(password, callback) {
    bcrypt.hash(password, SALT_ROUNDS, callback);
};

userSchema.methods.checkPassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
};

module.exports = mongoose.model('User', userSchema);