
const media_helper=require('../../helpers/media_helper');
const {Category}=require('../../models/category');
const util =require('util');



exports.addCategory=async function(req,res){
   try{
    const uploadImage=util.promisify(media_helper.upload.fields([{name:'Image',maxCount:1}]))
    try{

      await uploadImage(req,res);

    }catch(e){
        console.error(e);
        return res.status(500).json({type:e.name,message:`${e.message}} ${e.fields}`,storageErrors:e.storageErrors});
    }
    const image=req.files['image'][0];
    if(!image) return res.status(404).json({message:'No file found!'});
    req.body['image']=`${req.protocol}://${req.get('host')}/${image.path}`;
    let category=new Category(req.body);
    category=category.save();
    if(!category){
        return res.status(500).json({message:'The category could not be created'});
    }
    res.status(201).json(category);

   }catch(e){
    console.error(e);
    return res.status(500).json({type:e.name,message:e.message});

   }
};


//********************************************************************************************************************************************* */

exports.editCategory=async function(req,res){
    try{

        const {name,icon,colour}=req.body;
        const category=await Category.findByIdAndUpdate(req.params.id,{name,icon,colour},{new:true});
        if(!category){

            return res.status(404).json({message:'Category not found!'});
        }
        return res.json(category);


    }catch(e){
    console.error(e);
    return res.status(500).json({type:e.name,message:e.message});

   }
}

//********************************************************************************************************************************************** */



exports.deleteCategory=async function(req,res){
    try{

   const category=await Category.findById(req.params.id);
   if(!category){
    return res.status(404).json({message:'Category not found!'});
   }
   category.markedForDeletion=true;
   await category.save();
   return res.status(204).end();

    }catch(e){
    console.error(e);
    return res.status(500).json({type:e.name,message:e.message});

   }
}