const { required } = require("joi");
const mongoose =  require("mongoose");
const Schema  = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose);//we use plugin here becuz it automatically do salting and implement username and all

module.exports = mongoose.model('User',userSchema);