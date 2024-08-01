const{Schema,model}=require('mongoose');

const orderSchema=Schema({
    orserItems:[{
        type:Schema.Types.ObjectId,
        ref:'OrderItem',required:true
    }],
    shippingAdress:{type:String,required:true},
    city:{type:String,required:true},
    postalCode:String,
    country:{type:String,required:true},
    paymentId:String,
    status:{
        type:String,
        default:'pending',
        enum:[
            'pending','processed','shipped','out-for-delivery','delivered','cancelled','on-hold','expired',
        ]
    },
    statusHistory:{
        type:[String],
        required:true,
        default:['pending'],
        enum:[
            'pending','processed','shipped','out-for-delivery','delivered','cancelled','on-hold','expired',
        ]
    },
    totalPrice:Number,
    user:{type:Schema.Types.ObjectId,ref:'User'},
    dateOrdered:{type:Date,default:Date.now}

});
orderSchema.set('toObject',{virtuals:true});
orderSchema.set('toJson',{virtuals:true});

exports.Order=model('Order',orderSchema);