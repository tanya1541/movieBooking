const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const {body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

mongoose.connect('mongodb://localhost/movieBooking');
let db = mongoose.connection;

db.on('error', function(err){
    console.log(err);
});

db.once('open', function(){
    console.log("Connected to mongodb");
})

const app = express();
var cors = require('cors');

app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

const User = require("./models/users");
const Admin = require("./models/admins");
app.use(express.json());

app.post("/register",
[
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
  .notEmpty().withMessage('Email is required')
  .isEmail().custom(async value => {
    const existingUser = await User.findByEmail(value);
    if (existingUser) {
      throw new Error('A user already exists with this e-mail address');
    }
  }),
  body('password')
  .notEmpty().withMessage('Password is required')
  .isLength({min:8}).withMessage('Password should contain atleast 8 characters'),
  body('passwordConf').notEmpty().withMessage('Confirmation password is required')
  .custom((value, { req }) => {
    return value === req.body.password;
  }),
],
 async (req, res, next) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()){
    let err = errors.errors.map(error =>{
      return error.msg;
    })
    return res.status(400).json(err);
  }
    const { name, email, password, passwordConf } = req.body;
    const newUser = User({
        name, 
        email, 
        password,
        passwordConf 
    });
   
    try {
      await newUser.save();
    } catch {
      const error = new Error("Error! Something went wrong.");
      return res.json({errors: error});
    }
    
    res
      .status(201)
      .json({
        success: true,
        data: { 
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email 
          },
      });
  });

app.post("/login",
[
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
      let err = errors.errors.map(error =>{
        return error.msg;
      })
      return res.status(400).json(err);
    }
    let { email, password} = req.body;
   
    let existingMember;
    try {
      existingMember = await User.findOne({ email: email });
      if(!existingMember) {
        existingMember = await Admin.findOne({ email: email });
      }
    } 
    catch {
      const error = new Error("Error! Something went wrong.");
      return res.json({errors: error});
    }
    if (!existingMember || existingMember.password != password) {
      const error = Error("Wrong details please check at once");
      return res.json({errors: error});
    }
    let token;
    try {
      //Creating jwt token
      token = jwt.sign(
        { Id: existingMember.id, email: existingMember.email },
        "mashup_secret_key",
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
      const error = new Error("Error! Something went wrong.");
      return res.json({errors: error});
    }
   
    res
      .status(200)
      .json({
        success: true,
          Id: existingMember.id,
          name: existingMember.name,
          email: existingMember.email,
          isAdmin: existingMember.isAdmin,
          token: token
      });
  });

//   app.get('/', (req, res)=>{
//     const token = req.headers.authorization.split(' ')[1];
//     //Authorization: 'Bearer TOKEN'
//     if(!token)
//     {
//       res.status(200).json({success:false, message: "Error!Token was not provided."});
//     }
//     //Decoding the token
//     const decodedToken = jwt.verify(token,"mashup_secret_key" );
//     res.status(200).json({success:true, data:{userId:decodedToken.userId,email:decodedToken.email}})
// });



    app.listen(8080, function(){
        console.log('Server started on port 8080...');
    })