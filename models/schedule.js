var mongoose = require('mongoose');

var scheduleSchema = new mongoose.Schema({
    showtime:Date,
    seat:[{
        seat_id:String,
        available:Boolean,
        reserver:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    cinema:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Cinema'
    },

});

module.exports = mongoose.model('Schedule', scheduleSchema);