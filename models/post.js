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

postSchema.methods.getIndex = function(blogId, callback) {
    const self = this;
    this.model('Post').find({blogId}).sort({createdAt: 1}).exec(function(err, blogPosts) {
        if (err) return callback(err);

        callback(null, blogPosts.findIndex(blog => blog._id.equals(self._id)));
    });
};

module.exports = mongoose.model('Post', postSchema);