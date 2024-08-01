const {User}=require('../models/users') ;
const {Order}=require('../models/order');
const {OrderItem}=require('../models/orderItems');
const {CartProduct}=require('../models/cart_product');
const {Token}=require('../models/tokens');



exports.getUserCount=async function(req,res){
    try{

        const userCount=await User.CountDocuments();
        if(!userCount){
            return res.status(500).json({message:'Could not count users.'});
        }
        return res.json({userCount});

    }catch(e){
        console.error(e);
        return res.status(500).json({type:e.name,message:e.message});
    }
};


exports.deleteUser=async function(req,res){
    try{

        const userId=req.params.id;
        const user=await User.findById(userId);
        if(!user)
            return res.status(404).json({message:'User not found!'});
        const orders=await Order.find({user:userId});
        const orderItemIds=orders.flatMap((order)=>order.orderItems);

        await Order.deleteMany({_id:{$in:orderItemIds}});
        await CartProduct.deleteMany({_id:{$in:user.cart}});
        await User.findByIdAndUpdate(userId,{$pull:{cart:{$exists:true}}});
        await Token.deleteOne({userId:userId});
        await User.deleteOne({_id:userId});

    }catch(e){
        console.error(e);
        return res.status(500).json({type:e.name,message:e.message});
    }
};