const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    desc: String,
    imgUrl: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

postSchema.methods.getIndex = function(callback) {
    const self = this;
    this.model('Post').find({blogId: this.blogId}).sort({createdAt: 1}).exec(function(err, blogPosts) {
        if (err) return callback(err);

        callback(null, blogPosts.findIndex(blog => blog._id.equals(self._id)));
    });
};

postSchema
    .virtual('baseUrl')
    .get(function() {
        return `/blogs/${this.blogId}/posts`;
    });

module.exports = mongoose.model('Post', postSchema);