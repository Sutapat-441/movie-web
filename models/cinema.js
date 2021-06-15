var mongoose = require('mongoose');

var cinemaSchema = new mongoose.Schema({
    name:String,
    major:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Major'
    },
    system:String,
    seat:Array,
});

module.exports = mongoose.model('Cinema', cinemaSchema);
