const mongoose = require('mongoose');
const debug = require('debug')('api.mygram.svc.com:post-model');

const Schema = mongoose.Schema;

const schemaOptions = {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
}

// Create a schema that defines the shape of posts
const postSchema = new Schema({
    // A blog that the post belongs to
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    desc: String,
    imgUrl: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    ind: Number
}, schemaOptions);

// Calculate an index for a post to use in its URL by sorting all blog's posts in ascending order
// by their date. Takes an error-first callback function
postSchema.methods.getIndex = function(callback) {
    this.model('Post').find({blogId: this.blogId}).sort({createdAt: 1}).exec((err, blogPosts) => {
        if (err) return callback(err);

        const index = blogPosts.findIndex(blog => blog._id.equals(this._id));

        debug(`Calculated index ${index} for post ${this._id}`);
        this.ind = index;
        this.save(function(err) {
            if (err) return callback(err);

            callback(null, index);    
        });
    });
};

// Relative to the root path for a post without it's '/{id}' at the end of it
postSchema
    .virtual('baseUrl')
    .get(function() {
        return `/blogs/${this.blogId}/posts`;
    });

module.exports = mongoose.model('Post', postSchema);