const{Schema,model}=require('mongoose');

const orderItemSchema=Schema({
    product:{
        type:Schema.Types.ObjectId,ref:'Product',required:true,
    },
    productPrice:{
      type:Number,required:true
    },
    quantity:{
        type:Number,default:1
    },
    selectedSize:String,
    selectedColor:String,

});

orderItemSchema.set('toObject',{virtuals:true});
orderItemSchema.set('toJson',{virtuals:true});



exports.OrderItem=model('OrderItem',orderItemSchema);