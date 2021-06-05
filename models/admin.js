const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var adminSchema = new mongoose.Schema({
    adminname:String,
    password:String
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin',adminSchema);