const mongoose = require("mongoose");
const { mongo } = mongoose;


const CompanySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String
    },
    website:{
        type:String
    },
    location:{
        type:String
    },
    logo:{
        type:String // URL to company
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});

const CompanyModel = mongoose.model("Company", CompanySchema);

module.exports = CompanyModel;
