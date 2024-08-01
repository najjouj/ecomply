const {Schema,model}=require('mongoose');

const categorySchema=Schema({
    name:{type:String,required:true},
    colour:{type:String,default:'#000000'},
    image:{type:String,required:true},
    markedForDeletion:{type:Boolean,defaul:false}
});


exports.category=model('Category',categorySchema);