const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const Product=require('./models/productModel')

const User = require('./models/userRegister');

const app=express();
const port=5000;

app.use(express.json());
app.use(cors())

mongoose.connect('mongodb+srv://siva:2829@cluster0.76cwkcq.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log('DB connected');
    app.listen(port,()=>{console.log(`server running at http://localhost:${port}`)});

}).catch((e)=>{console.log('DB error',e)})



app.get('/',(req,res)=>{
    res.send('home route')
})
//get the all the data in a database
app.get('/products',async(req,res)=>{
    try {
        const products=await Product.find({});
        console.log(products)
        res.status(200).json(products);
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
})
//retrieve the particular product by id

app.get('/products/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const product=await Product.findById(id);
        res.status(200).json(product);
        
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})
//update the product
app.put('/products/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const product= await Product.findByIdAndUpdate(id,req.body)
        if(!product){
            return res.status(404).json({message:`cannot find the product with this id: ${id} `})
        }
        const updatedproduct= await Product.findById(id);
        res.status(200).json(updatedproduct)

    } catch (error) {

        res.status(500).json({message:error.message});
    }
})

// delete the product
app.delete('/products/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const product= await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message:`cannot find the product with this id: ${id} `})
        }
        res.status(200).json(product)
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
})

//create the product in database

app.post('/product',async(req,res)=>{
 try {
    const product=await Product.create(req.body)
    res.status(200).json(product);
    
 } catch (error) {
    console.log(error.message);
    res.status(500).json({message:error.message})  
 }

})

//create user
app.post('/user',async(req,res)=>{
    const {email}=req.body;
   
    const user=await User.create(req.body)
    const userExisted=await User.findOne({email:email})
  
    try {
        if(user){
            res.status(200).json(user)
        }
        else{
            res.json('user already existed')
        }
        
    } catch (error) {
        res.status(500).json({message:error})
        
    }
})

app.post('/login',async(req,res)=>{

    const{email,password}=req.body;
    const user=await User.findOne({email:email});
    try {
        if(user){
            if(user.password===password){
                res.status(200).json('success')
            }
            else{
                res.json('Password Was Incorrect')
            }
        }
        else{
            res.json('User Not Found')
        }
        
    } catch (error) {
        res.status(500).json({message:error})
        
    }

})