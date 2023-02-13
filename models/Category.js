const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    subcategory:{type:String,required:true},
    desc:{type:String,required:true},
},{timestamps:true})

module.exports = mongoose.model("category",categorySchema);