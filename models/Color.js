const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    productId:{type:String,required:true},
    colorName:{type:String,required:true},
    image:{type:Array,required:true}
},{timestamps:true})

module.exports = mongoose.model("color",colorSchema);