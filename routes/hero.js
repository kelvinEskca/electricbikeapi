const Hero = require("../models/Hero");
const router = require("express").Router();
const cloudinary = require('../utils/cloudinary');
const {verifyToken,verifyTokenAuthorization,verifyTokenAdmin} = require("./verifyToken");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");

const saveHero = async (hero) => {
  const newHero = new Hero(hero);
  const savedHero = await newHero.save();
  console.log(savedHero);
  return savedHero;
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
    const newHero = {...req.body, image: image};
    const savedHero = await saveHero(newHero);
    console.log(savedHero);
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


//update Hero;
router.post("/edit/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updatedHero = await Hero.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedHero);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//delete Hero;
router.post("/delete/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deletedHero = await Hero.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedHero);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get Hero
router.get("/:id", async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    res.status(200).json(hero);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get all Heros;
router.get("/", async (req, res) => {
  try {
    const heros = await Hero.find();
    res.status(200).json(heros);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});


module.exports = router;
