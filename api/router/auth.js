const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require("../models/users");
const Admin = require("../models/admins");

router.post("/register",
[
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
  .notEmpty().withMessage('Email is required')
  .isEmail().custom(async value => {
    const existingUser = await User.findOne({email: value});
    if (existingUser) {
      throw new Error('A user already exists with this e-mail address');
    }
  })
  ,
  body('password')
  .notEmpty().withMessage('Password is required')
  .isLength({min:8}).withMessage('Password should contain atleast 8 characters'),
  body('passwordConf').notEmpty().withMessage('Confirmation password is required')
  .custom((value, { req }) => {
    return value === req.body.password;
  }).withMessage('Passwords do not match'),
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

router.post("/login",
[
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
      return res.json({errors: "Error! Something went wrong."});
    }
    if (!existingMember || existingMember.password != password) {
      return res.json({errors: "Wrong details please check at once"});
    }
    let token;
    try {
      //Creating jwt token
      token = jwt.sign(
        { Id: existingMember.id, email: existingMember.email, isAdmin: existingMember.isAdmin},
        "mashup_secret_key",
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
      return res.json({errors: "Error! Something went wrong."});
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

  const verifyToken = (req,res, next)=> {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    jwt.verify(token, "mashup_secret_key", (err, user)=> {
        if(err) {
            return res.status(403).json({message: "invalid token"});
        }
        req.user = user;
        next();
    });
};

  router.post("/logout", verifyToken, (req, res)=> {
    res.json({message: "Logout successful"})
  });

  module.exports = router;