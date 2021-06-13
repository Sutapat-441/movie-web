var mongoose = require('mongoose');

var likeSchema = new mongoose.Schema({
    movies: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'movies'
        }
    }
});

module.exports = mongoose.model('Like', likeSchema);