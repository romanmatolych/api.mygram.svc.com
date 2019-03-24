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
// by their date before saving.
postSchema.pre('save', function(next) {
    if (this.isNew) {
        this.model('Post').find({blogId: this.blogId}).sort({createdAt: 1}).exec((err, blogPosts) => {
            if (err) return next(err);

            if (blogPosts.every(post => post.createdAt < this.createdAt)) {
                this.ind = blogPosts.length;
                debug(`Calculated index ${this.ind} for post ${this._id}`);
                next();
            } else {
                next(new Error("Error calculating post's index"));
            }
        });
    } else {
        next();
    }
});

// Path for a post that is relative to the root
postSchema
    .virtual('url')
    .get(function() {
        return `/blogs/${this.blogId}/posts/${this.ind + 1}`;
    });

module.exports = mongoose.model('Post', postSchema);