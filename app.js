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
// app.use(authJwt());
// app.use(errorHandler);
// app.get(`/users`,(req,res)=>{
   
//     res.json([{name:'paul',org:'najiatech',age:120}])
// });


mongoose.connect("mongodb+srv://najia:najia@cluster0.efycoyh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {

    console.info('Connected to database');
}).catch((e) => {
    console.info('error:');
    console.info(e);

});
     const authRouter = require('./routes/auth');
// const productsRouter = require('./routes/products');
 const usersRouter = require('./routes/users');
 app.use('/',authRouter);
app.use( usersRouter);
// app.use('/products', productsRouter);
// console.log('hello');

app.post('/test',(_,res)=>{
    console.log('app request');
    res.json({message:'test test'});
})




// app.use((req,res,next)=>{
//     console.log('A request has been made to your server');
//     return next();
// });

// app.use((_,__,next)=>{

//     console.log('Middleware 2');
//     return next();

// });


// const authorization=(_,res,next)=>{
//     const isAuthorized=true;
//     if(isAuthorized){
//         console.log('User is Authorized');
//         return next();
//     }else{
//         return res.status(401).send('Unauthorized');
//     }

// };

// app.get('/',authorization,(req,res)=>{
//     return res.status(401).send("Sorry can't find that");
// });


// app.get('/watch/videos/:id',authorization,(req,res)=>{
//     return res.json(({videoId:req.params.id}));

// });




app.listen(3000, '192.168.172.223', () => { console.info(`Server is running at http://192.168.172.223:3000`) });

//CRUD

// //CREATE DATA

// app.post();


// //GET DATA

// app.get();

// //UPDATE DATA

// app.put();

// //DELETE DATA

// app.delete();