const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{type:String,required:true, trim:true},
    email:{type:String,required:true, trim:true},
    passwordhash:{type:String,required:true},
    street:String,
    apartement:String,
    city:String,
    postalCode:String,
    country:String,
    phone:{type:String,required:true,trim:true},
    isAdmin:{type:Boolean,default:false},
    resetPasswordOtp:Number,
    resetpasswordOtpExpires:Date,
    cart:[{type:mongoose.Types.ObjectId,ref:'CartProduct'}],
    wishList:[
       {
        productId:{  type:mongoose.Types.ObjectId,ref:"Product",required:true},
        productName:{type:String,required:true},
        productImage:{type:String,required:true}

        }
    ]

});

userSchema.index({email:1},{unique:true});
userSchema.set('toObject',{virtuals:true});
userSchema.set('toJson',{virtuals:true});

// module.exports=mongoose.model('User',userSchema);

var User = mongoose.model('User', userSchema);
module.exports = User;

// exports.User=model('User',userSchema);

// ,validate:{
//     validator:(value)=>{
//         const re=/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
//         return value.match(re);

//     },
//     message:'Please enter a valid email adress'
// }