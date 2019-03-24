const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schemaOptions = {
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
};

// Create a schema that defines the shape of blogs
const blogSchema = new Schema({
    // Owner of the blog
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String, 
        required: true,
        trim: true
    },
    createdAt: {type: Date, default: Date.now}
}, schemaOptions);

// Path for a blog that is relative to the root
blogSchema
    .virtual('url')
    .get(function() {
        return `/blogs/${this._id}`;
    });

module.exports = mongoose.model('Blog', blogSchema);