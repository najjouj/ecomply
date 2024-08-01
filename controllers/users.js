
const User=require('../models/users');



exports.getUsers=async(_,res)=>{
    try{
        console.log('hellowin 1');
        const users=await User.find().select('name email isAdmin');
        console.log('hellowin');

        if(!users){
            return res.status(404).json({
             message:'Users not found'
            });
        }
        return res.json(users);

    }catch(e){
        console.error(e);
        return res.status(500).json({type:e.name,message:e.message});
    }

}



exports.getUserById=async(req,res)=>{
    try{
        console.log('ffffff');
        console.log(req.params);
       const {id}=req.params.id;
        
        const user=await User.findById(req.params.id).select('-passwordHadh -resetPasswordOtp -resetPasswordOtpExpires -cart');
        if(!user){
            return res.json(404).json({message:'User not found'});
        }
        return res.json(user);

    }catch(e){
        console.error(e);
        return res.status(500).json({type:e.name,message:e.message});
    }
}
exports.updateUser=async(req,res)=>{
    try{
        console.log(req.body);
        const {name,email,phone}=req.body;
        const user=await User.findByIdAndUpdate(
            req.params.id,{name,email,phone},{new:true}
        );
        console.log(user);
        if(!user){
            return res.json(404).json({message:'User not found'});
        }
        user.passwordhash=undefined;
        user.cart=undefined;
        return res.json(user);

    }catch(e){
        console.error(e);
        return res.status(500).json({type:e.name,message:e.message});
    }
}
