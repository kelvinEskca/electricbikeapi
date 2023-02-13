const Category = require('../models/Category');
const router = require('express').Router();
const { verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');


//create a new Category;
router.post('/', verifyTokenAdmin, async(req,res)=>{
    const newCategory = new Category(req.body);
    try{
        const savedCategory = await newCategory.save();
        res.status(200).json("Category Added");
        console.log(savedCategory);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//update Category;
router.put("/:id", verifyTokenAdmin, async(req,res)=>{
    try{
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedCategory);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})

//delete Category;
router.post("/delete/:id", verifyTokenAdmin, async (req,res)=>{
    try{
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedCategory);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})

//get Category
router.get("/:id", async (req,res)=>{
    try{
        const Category = await Category.findById(req.params.id);
        res.status(200).json(Category);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//get all Categorys;
router.get('/', async (req,res)=>{
    try{
        const Categorys = await Category.find();
        res.status(200).json(Categorys);
    }
    catch(err){
        res.status(500).json(err)
        console.log(err)
    }
});

module.exports = router