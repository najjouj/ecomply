const jwt=require('jsonwebtoken');
const {Token}=require('../models/tokens');
const{User}=require('../models/users');
async function errorHandler(error,req,res,next){
    if(error.name=== 'UnhauthorizedError'){
        if(!error.message.includes('jwt expired')){
            return res.status(error.status).json({
                type:error.name,message:error.message
            });
        }
        try{
            const tokenHeader=req.header('Authorization');
            const accessToken=tokenHeader?.split('')[1];
            let token=await Token.findOne({
                accessToken,
                refreshToken:{$exists:true}

            });
            if(!token){
                res.status(401).json({
                    type:'unauthorized',
                    message:'Token does not exist.'
                });
            }
            const userData=jwt.verify(token.refreshToken, process.env.example.REFRESH_TOKEN_SECRET,{expiresIn:'24h'});
            const user=await User.findById(userData.id);
            if(!user){
                return res.status(404).json({
                    message:'Invalid user!'
                });
            }
            const newAccessToken=jwt.sign({
                id:user.id,isAdmin:user.isAdmin

            },process.env.example.ACCESS_TOKEN_SECRET);
            req.headers['authorization']=`Bearer ${newAccessToken}`;

            await Token.updateOne(
                {_id:token.id},
                {accessToken:newAccessToken}
            ).excec();
            
            res.set('Authorization',`Bearer ${newAccessToken}`);
            return next();

        }catch(refreshError){
            return res.status(401).json({
                type:'unauthorized',
                message:refreshError.message

            });

        }
    }
}

module.exports=errorHandler;