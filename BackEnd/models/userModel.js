const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum:['student','recruiter'],
        required: true
    },
    profile: {
        bio:{type: String},
        skills:[{type: String}], // array of skills
        resume_link:{type: String},
        //resume:{type: String}, // URL to resume file
        //resumeOriginalName:{type: String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto: {
            type:String,
            default:""
        }
    },  
},{timestamps:true});

const UserModel = mongoose.model("User", UserSchema);
module.exports = { UserModel };
