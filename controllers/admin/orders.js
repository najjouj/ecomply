const{Order}=require('../../models/order');






exports.getOrders=async function(req,res){
    try{

   const orders=await Order.find().select(' -statushistory').sort({dateOrdered:-1});
   if(!orders){
    return res.status(404).json({message:'Orders not found!'});
   }
   return res.json(orders);

    }catch(e){
    console.error(e);
    return res.status(500).json({type:e.name,message:e.message});

   }
}