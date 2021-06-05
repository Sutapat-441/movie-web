var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({ //โครงสร้างข้อมูล
    name:String,
    image:String,
    type:String,
    time:String,
    language:Array,
    URL:String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,//เรียกข้อมูลมาจากมาจากcomment
            ref:'Comment'
        }
    ]
});

// movieSchema.index( { name: "text"} );

module.exports = mongoose.model('Movie',movieSchema);