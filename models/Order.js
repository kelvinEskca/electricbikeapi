const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    customerId:{type:String},
    paymentIntentId:{type:String},
    products:[{
        productid:{
            type:String,
        },
        qty:{
            type:Number,
            default:1
        },
        price:{
            type:Number,
        },
        images:{
            type:Array
        },
        category:{
            type:String
        },
        desc:{
            type:String
        },
        sizes:{
            type:String
        },
        name:{
            type:String
        }
    }],
    subTotal:{type:Number,required:true},
    Total:{type:Number,required:true},
    address:{type:Object,required:true},
    delivery_status:{type:String,default:"Pending"},
    payment_status:{type:String,required:true},
},{timestamps:true})

module.exports = mongoose.model("order",orderSchema);