
const User=require('../models/users');
const bodyParser = require("body-parser");
const cors = require('cors');
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
// const errorHandler=require('./middlewires/error_handlers');
// const authJwt=require('./middlewires/jwt');

const app = express();
app.use(morgan('tiny'));
app.use(cors(''));

app.options('*', cors());
app.use(bodyParser.json());

const router=express.Router();


const usersController=require('../controllers/users');

console.log('router users');
router.get('/users',usersController.getUsers);
console.log('here we go2');
router.get('/users/:id',usersController.getUserById);

router.put('/users/:id',usersController.updateUser);


module.exports=router;