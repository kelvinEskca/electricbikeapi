const Cart = require('../models/Cart');
const router = require('express').Router();
const { verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');


//create a new cart;
router.post('/', verifyToken, async(req,res)=>{
    const newCart = new Cart(req.body);
    try{
        const savedCart = await newCart.save();
        res.status(200).json("Cart Added");
        console.log(savedCart);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//update cart;
router.put("/:id", verifyToken, async(req,res)=>{
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedCart);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})

//delete Cart;
router.delete("/:id", verifyToken, async (req,res)=>{
    try{
        const deletedCart = await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedCart);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})

//get User Cart
router.get("/:id", verifyTokenAuthorization, async (req,res)=>{
    try{
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//get all Carts;
router.get('/', verifyTokenAdmin, async (req,res)=>{
    try{
        const carts =  await Cart.find();
        res.status(200).json(carts);
    }
    catch(err){
        res.status(500).json(err)
        console.log(err)
    }
});

module.exports = router