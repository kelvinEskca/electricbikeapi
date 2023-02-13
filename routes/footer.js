const Footer = require("../models/Footer");
const router = require("express").Router();
const cloudinary = require('../utils/cloudinary');
const {verifyToken,verifyTokenAuthorization,verifyTokenAdmin} = require("./verifyToken");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");

const saveFooter = async (footer) => {
  const newFooter = new Footer(footer);
  const savedFooter = await newFooter.save();
  console.log(savedFooter);
  return savedFooter;
}

router.post("/", verifyTokenAdmin, upload.array("video"), async (req, res) => {
  try {
    const uploadPromises = req.files.map(async file => {
      const result = await cloudinary.uploader.upload(file.path);
      return result;
    });
    const uploadResults = await Promise.all(uploadPromises);
    const video = uploadResults.map(result => {
      return {public_id:result.public_id, url:result.url}
    });
    const newFooter = {...req.body, video: video};
    const savedFooter = await saveFooter(newFooter);
    console.log(savedFooter);
    res.json({
      message: "Videos uploaded successfully",
      videos: uploadResults.map(result => result.url)
    });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//update Footer;
router.post("/edit/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updatedFooter = await Footer.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedFooter);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//delete Footer;
router.post("/delete/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deletedFooter = await Footer.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedFooter);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get Footer
router.get("/:id", async (req, res) => {
  try {
    const footer = await Footer.findById(req.params.id);
    res.status(200).json(footer);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get all Footers;
router.get("/", async (req, res) => {
  try {
    const footers = await Footer.find();
    res.status(200).json(footers);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});


module.exports = router;
