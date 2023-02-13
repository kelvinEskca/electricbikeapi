const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    image: { type:Array,required:true},
    sizes: { type: Array, required: true },
    colors: { type:Array,required:false},
    colorName: { type:String,required:false},
    quantity: { type: Number, default: 1 },
    qty: { type: Number, default: 1 },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
