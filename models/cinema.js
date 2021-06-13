var mongoose = require('mongoose');

var cinemaSchema = new mongoose.Schema({
    name:String,
    major:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Major'
    },
    system:[{
        type:String,
        enum:['4D','3D','Normal'],
        default:'Normal'
    }],
    seat:Array,
});

module.exports = mongoose.model('Cinema', cinemaSchema);
