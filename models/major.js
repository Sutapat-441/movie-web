var mongoose = require('mongoose');

var majorSchema = new mongoose.Schema({
    name:String,
    cinema:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cinema'
    }],
    schedule:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Schedule'
    }]
});

module.exports = mongoose.model('Major', majorSchema);