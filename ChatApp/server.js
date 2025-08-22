const express=require('express');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const Registeruser=require('./model');
const middleware=require('./middleware');
const cors=require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const messageModel = require('./Msgmodel'); // Importing the message model
const app=express();

mongoose.connect('//your mongodb connection URL')//your url
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.use(cors({origin:"*"}))

app.get('/',(req,res)=>{
    res.send('Hello, World!');
});

app.use(express.json());
app.post('/register',async (req,res)=>{
    try{
      const { username, email, password, confirmpassword } = req.body;
      let exist=await Registeruser.findOne({ email: email });
      if (exist) {
          return res.status(400).json({ error: 'Email already exists' });
      }
      if (password !== confirmpassword) {
          return res.status(400).json({ error: 'Passwords do not match' });
      }
      let newUser = new Registeruser({
          username,
          email,
          password,
          confirmpassword
      });
        await newUser.save(); //for saving the user to the database without any delay
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch(err){
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login',async(req,res)=>{
    try{
      const {email,password}=req.body;
      let exist=await Registeruser.findOne({email:email});
      if(!exist){
        return res.status(400).send("User not Found");
      }
      if(exist.password!=password){
         return res.status(400).send("Invalid credentials");
      }

      let payload={
        user:{
            id:exist.id
        }
      }
      jwt.sign(payload,'jwtSecret',{expiresIn:36000000},
        (err,token)=>{
            if(err) throw err;
            return res.json({token})
        }
      )


    }catch(err){
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/myprofile',middleware,async(req,res)=>{
    try{
       let exist=await Registeruser.findById(req.user.id);
       if(!exist){
        return res.status(400).send("User Not Found");
       }
       res.json(exist);
    }catch(err){
        console.error('Error during profile access:', err);
        return res.status(500).send('Invalid token');
    }
})

app.listen(5000,()=>{
    console.log('Server is running on port 5000');
});

app.post('/addmsg', middleware, async (req, res) => {
    try {
        const { text } = req.body;
        const exist = await Registeruser.findById(req.user.id);
        if (!exist) {
            return res.status(400).send("User not found");
        }

        const newMessage = new messageModel({
            user: req.user.id,
            username: exist.username,
            text
        });

        await newMessage.save();
        let allmsg=await messageModel.find();
        res.json(allmsg);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/getmsg', middleware, async (req, res) => {
    try {
        let allmsg = await messageModel.find();
        res.json(allmsg);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

});

