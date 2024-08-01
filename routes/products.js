const express=require("express");

const router = express();
const productsControllers=require('../controllers/products');

router.get('/products/:id',productsControllers.getProductsCount);
router.get('/products/count',productsControllers.getProductDetails);
router.delete('/products/:id',(req,res)=>{});
router.put('/products/:id',(req,res)=>{});

module.exports=router;