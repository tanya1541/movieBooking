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

const auth = require("./router/auth");
app.use("/auth", auth);

const admin = require("./router/admin");
app.use("/admin", admin);


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