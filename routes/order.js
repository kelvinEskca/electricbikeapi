const Order = require('../models/Order');
const router = require('express').Router();
const { verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');

//update Order;
router.put("/:id", verifyTokenAdmin, async(req,res)=>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedOrder);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})

//delete Order;
router.delete("/:id", verifyTokenAdmin, async (req,res)=>{
    try{
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedOrder);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})

//get User Order
router.get("/:id", verifyTokenAuthorization, async (req,res)=>{
    try{
        const orders = await Order.find({userId: req.params.id});
        res.status(200).json(orders);
        console.log(req.params.id);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//get all Orders;
router.get('/', verifyTokenAdmin, async (req,res)=>{
    try{
        const orders =  await Order.find();
        res.status(200).json(orders);
    }
    catch(err){
        res.status(500).json(err)
        console.log(err)
    }
});

module.exports = router