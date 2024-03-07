const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const Show = require("../models/shows");

router.get("/", (req, res)=>{
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    jwt.verify(token, "mashup_secret_key", (err, user)=> {
        if(err) {
            return res.status(403).json({message: "invalid token"});
        }
        req.user = user;
    });
    try{
    if(req.user.isAdmin){
    Show.find({})
    .then((shows)=>{
        res.status(200).json({success: true, shows});
    })
    .catch(error=>{
        res.status(400).json({success: false, errors: error});
    })
}else{
    Show.find({isActive: true})
    .then((shows)=>{
        res.status(200).json({success: true, shows});
    })
    .catch(error=>{
        res.status(400).json({success: false, errors: error});
    })
}
}
catch(error){
    res.status(400).json({success: false, message: "Token expired!"});
}
});

router.get("/:id", (req, res)=>{
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    jwt.verify(token, "mashup_secret_key", (err, user)=> {
        if(err) {
            return res.status(403).json({message: "invalid token"});
        }
        req.user = user;
    });
    try{
    let showId = req.params.id;
    Show.findById(showId)
    .then(show=>{
        res.status(200).json({success: true, show});
    })
    .catch(error=>{
        res.status(400).json({success: false, errors: error})
    })
}
catch(error){
    res.status(400).json({message: "Token expired!"})
}
});

module.exports = router;