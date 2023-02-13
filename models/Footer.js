const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    video: { type:Array,required:true},
    subtitle: { type: String, required: true},
    cta: { type: String, required: true},
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("footer", footerSchema);
