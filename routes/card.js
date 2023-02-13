const Card = require("../models/Card");
const router = require("express").Router();
const cloudinary = require('../utils/cloudinary');
const {verifyToken,verifyTokenAuthorization,verifyTokenAdmin} = require("./verifyToken");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");

const saveCard = async (card) => {
  const newCard = new Card(card);
  const savedCard = await newCard.save();
  console.log(savedCard);
  return savedCard;
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
    const newCard = {...req.body, image: image};
    const savedCard = await saveCard(newCard);
    console.log(savedCard);
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

//update Card;
router.post("/edit/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCard);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//delete Card;
router.post("/delete/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedCard);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get Card
router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get all Cards;
router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});


module.exports = router;
