const Color = require("../models/Color");
const router = require("express").Router();
const cloudinary = require('../utils/cloudinary');
const {verifyToken,verifyTokenAuthorization,verifyTokenAdmin} = require("./verifyToken");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");

const saveColor = async (color) => {
  const newColor = new Color(color);
  const savedColor = await newColor.save();
  console.log(savedColor);
  return savedColor;
}


router.post("/", verifyTokenAdmin, upload.array("image"), async (req, res) => {
  try {
    const uploadPromises = req.files.map(async file => {
      const result = await cloudinary.uploader.upload(file.path);
      return result;
    });
    const uploadResults = await Promise.all(uploadPromises);
    const image = uploadResults.map(result => {
      return {public_id:result.public_id, url:result.url}
    });
    const newColor = {...req.body, image: image};
    const savedColor = await saveColor(newColor);
    res.json({
      message: "Images uploaded successfully",
      images: uploadResults.map(result => result.url)
    });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
    try {
      const color = await Color.find({productId:req.params.id});
      res.status(200).json(color);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
});



module.exports = router;
