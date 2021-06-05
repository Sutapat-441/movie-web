var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    phone:Number,
    email:String,
    password: String,
    profileImage:String,
    firstname:String,
    lastname:String,
    role:{
        type : String,
        enum :['member','admin'],
        default:'member'
    },
    //isAdmin: {type: Boolean, default: false},
    // like : [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Liked',
    //         autopopulate: true
    //     }
    // ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);