const router = require("express").Router();
const dotenv = require("dotenv");
const express = require('express')
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');
let endpointSecret;

//endpointSecret = 'whsec_0cc3b1da58c6f0908d102c7c692220e7e90dd22221f60585c77dbd7adb2db4bb';

router.post('/create-checkout-session', async (req, res) => {
   const cart = req.body.items.map((item)=>{
      return {
         name:item.name,
         images:[item.image[0].url], 
         qty:item.qty,
         price:item.price,
         desc:item.desc,
         sizes:item.size,
         category:item.category 
      }
   })

   const customer = await stripe.customers.create({
      metadata:{
         userId:req.body.userId,
         cart:JSON.stringify(cart)
      }
   })
   const line_items = req.body.items.map((item)=>{
      return {
         price_data:{
            currency:"usd",
            product_data:{
               name:item.name,
               images:[item.image[0].originalname],
               description:item.desc,
               metadata:{
                  id:req.body.userId
               }
            },
            unit_amount:item.price * 100,
         },
         quantity: item.qty,
      }
   })
   const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {allowed_countries: ['US', 'CA']},
      shipping_options: [
         {
            shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {amount: 0, currency: 'usd'},
            display_name: 'Free shipping',
            delivery_estimate: {
               minimum: {unit: 'business_day', value: 5},
               maximum: {unit: 'business_day', value: 7},
            },
            },
         },
      ],
      customer:customer.id,
     line_items,
     phone_number_collection: {
      enabled: true,
     },
     mode: 'payment',
     success_url: `${process.env.CLIENT_URL}/success`,
     cancel_url: `${process.env.CLIENT_URL}/`,
   });
 
   res.send({url:session.url});
});

//create Order;
const createOrder = async (customer,data) =>{
   const items = JSON.parse(customer.metadata.cart);
   const newOrder = new Order({
      userId:customer.metadata.userId,
      customerId:data.customer,
      paymentIntentId:data.payment_intent,
      products:items,
      subTotal:data.amount_subtotal,
      Total:data.amount_total,
      address:data.customer_details,
      payment_status:data.payment_status,
   })

   try{
      const savedOrder = await  newOrder.save();
      console.log(savedOrder);
   }
   catch(err){
      console.log(err)
   }
}

router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
   let data;
   let eventType;
   if(endpointSecret){
      let event;

      try {
         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
         console.log("verified");
      } 
      catch (err) {
         console.log("unverified");
         res.status(400).send(`Webhook Error: ${err.message}`);
         return;
      }

      data = event.data.object;
      eventType = req.body.type;
   }
   else{
      data = req.body.data.object;
      eventType = req.body.type
   }

  // Handle the event
   if(eventType === "checkout.session.completed"){
      stripe.customers.retrieve(data.customer).then((customer) =>{
         createOrder(customer,data);
      }).catch(err =>{
         console.log(err)
      })
   }

  // Return a 200 res to acknowledge receipt of the event
  res.send().end();
});

module.exports = router;