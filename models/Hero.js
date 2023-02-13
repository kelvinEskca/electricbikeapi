const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type:Array,required:true},
    subtitle: { type: String, required: true},
    cta: { type: String, required: true},
    ctatwo: { type: String, required: false},
    active: { type: Boolean, default: false },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("hero", heroSchema);
