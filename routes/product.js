const Product = require("../models/Product");
const router = require("express").Router();
const cloudinary = require('../utils/cloudinary');
const {verifyToken,verifyTokenAuthorization,verifyTokenAdmin} = require("./verifyToken");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");

const saveProduct = async (product) => {
  const newProduct = new Product(product);
  const savedProduct = await newProduct.save();
  console.log(savedProduct);
  return savedProduct;
}


router.post("/", verifyTokenAdmin, upload.array("image"), async (req, res) => {
  try {
    const sizesArray = req.body.sizes.split(',').map(size => size.trim());
    const uploadPromises = req.files.map(async file => {
      const result = await cloudinary.uploader.upload(file.path);
      return result;
    });
    const uploadResults = await Promise.all(uploadPromises);
    const image = uploadResults.map(result => {
      return {public_id:result.public_id, url:result.url}
    });
    const newProduct = {...req.body, image: image, sizes: sizesArray};
    const savedProduct = await saveProduct(newProduct);
    console.log(savedProduct);
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

//update product;
router.put("/update/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//delete product;
router.post("/delete/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get all products;
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/female/:id", async (req, res) => {
  try {
    const products = await Product.find({category:req.params.id});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/male/:id", async (req, res) => {
  try {
    const products = await Product.find({category:req.params.id});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
