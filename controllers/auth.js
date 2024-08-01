
const { validationResult } = require('express-validator');
const User = require('../models/users');
const Token = require('../models/tokens');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const mailSender=require('../helpers/email_sender');

exports.register = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    const errorsMessages = errors.array().map((errors) => ({
      field: errors.path,
      message: errors.msg
    }));
    console.log('iinside');
    return res.status(400).json({ message: errorsMessages });

  }

  try {
  
    console.info(req.body);
  
    let user = new User({
      ...req.body,
      passwordhash: bcrypt.hashSync(req.body.password, 8)
    });

    console.log(user.email);
    console.log('creating user');
    console.log(user);
    user = await user.save();

    if (!user) {

      return res.status(500).json({ type: 'Internal server error', message: 'Could not create a new user' });
    }

  } catch (e) {
    if (e.message.includes('email_1 dup key')) {
      return res.status(409).json({
        type: 'AuthError',
        message: 'User with that email already exists'

      });
    }
    return res.status(400).json({ type: e.type, message: e.errorsMessages });

  }

}
exports.login = async (req, res) => {

 try{
  console.log('login step!');
  const {email,password}=req.body;
  console.log(email);
  const user=await User.findOne({email:email});
  if(!user){
    return res.status(404).json({message:'User not found \n Check your email'});
  }
  if(!bcrypt.compareSync(password,user.passwordhash)){
    return res.status(400).json({

      message:'Incorrect password'
    });
  }
   console.log(user.id);
  
  const accessToken = jwt.sign({ id:user.id,isAdmin:user.isAdmin }, 'sdf90wjesdf90wjesdf90wjesdf90wje',{expiresIn:'24'});
  
  const refreshToken = jwt.sign({ id:user.id,isAdmin:user.isAdmin }, 'sdf90wejsdf90wejsdf90wejsdf90wej',{expiresIn:'60d'});
  

  const token=await Token.findOne({userId:user.id});
 
  if(token) await token.deleteOne();
  
  await new Token ({userId:user.id,accessToken:accessToken,refreshToken:refreshToken}).save();
  
  user.passwordhash=undefined;
 
  return res.json({...user.doc,accessToken});

 }catch(e){
  return res.status(500).json({
    type:e.name,
    message:e.message
  });
 }


}

exports.verifyToken = async (req, res) => {

 try{

     
  const accesToken=req.headers.authorization;
  if(!accesToken) return res.json(false);
  accesToken=accesToken.replace("Bearer",'').trim();

  const token=await Token.findOne({accesToken});
  if(!token) return res.json(false);

  const tokenData=jwt.decode(token.refreshToken);
  const user=await User.findById(tokenData.id);
  if(!user)return res.json(false);
  const isValid=jwt.verify(token.refreshToken,'sdf90wejsdf90wejsdf90wejsdf90wej');
  if(!isValid) return res.json(false);
  return res.json(true);



 }catch(e){
  return res.status(500).json({
    type:e.name,
    message:e.message
  });
 }

}

exports.forgotPassword = async (req, res) => {

   
  try{
    const {email}=req.body;
    const user=await User.findOne({email});
   console.log(user);
   if(user){
    console.log('reset1');
    const otp=Math.floor(1000+Math.random()* 9000);
    console.log(otp);
    user.resetPasswordOtp=otp;
    console.log(user);
    user.resetpasswordOtpExpires=Date.now()+600000;
    console.log(user);
    await user.save();
    console.log('saved');
    const response=await mailSender.sendMail(
          'email,Password reset OTP',`Your OTP for password reset is:${otp} `
        );
        console.log(response);
   }
    if(!user){
      return res.status(404).json({
 
        message:'User with that email does NOT exist!'
      });
     
     // const otp=Math.floor(1000+Math.random()* 9000);
    //   console.log('reset2');
    //   user.resetPasswordOtp=otp;
    //   console.log('reset3');
    //   user.resetpasswordOtpExpires=Date.now()+600000;
    //   console.log('reset');
    //  // console.log(user);
    //   await user.save();
    //   console.log('saved');
    //   const response=await mailSender.sendMail(
    //     'email,Password reset OTP',`Your OTP for password reset is:${otp} `
    //   );
    //   res.status.json({
    //     message:response.message 
    //   });
    }
  }catch(e){
    console.log(e);
    return res.status(500).json({
      type:e.name,message:e.message
    });
  }

}
exports.verifyOtp = async (req, res) => {
   try{

      const {email,otp}=req.body;
      const user =await User.findOne({email});
      if(!user){
        return res.status(404).json({message:'user not found!'});
      }
      if(user.resetPasswordOtp!==+otp || user.resetpasswordOtpExpires< Date.now()){
        return res.status(401).json({message:'Invalid or expired OTP'});

      }
      user.resetPasswordOtp=1;
      user.resetpasswordOtpExpires=undefined;
      await user.save();
      return res.json({message:'OTP confirmed successfully.'});

   }catch(e){
    console.log(e);
    return res.status(500).json({
      type:e.name,message:e.message
    });
  }


}
exports.resetPassword = async (req, res) => {

try{
  const {email,newPassword}=req.body;
  
  const user =await User.findOne({email});
      if(!user){
        return res.status(404).json({message:'user not found!'});
      }
      if(user.resetPasswordOtp!==1){
        return res.status(401).json({message:'Confirm otp befor reseting password!'});
      }
      res.passwordhash=bcrypt.hashSync(newPassword,8);
      user.resetPasswordOtp=undefined;
      await user.save();
      return res.json({message:'password reset sucessfully'});

}catch(e){
    console.log(e);
    return res.status(500).json({
      type:e.name,message:e.message
    });
  }

}