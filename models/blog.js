const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
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
    themeId: {  // TODO: Implement themes
        type: Number,
        default: 1
    },
    createdAt: {type: Date, default: Date.now}
});

blogSchema
    .virtual('url')
    .get(function() {
        return `/blogs/${this._id}`;
    });

module.exports = mongoose.model('Blog', blogSchema);