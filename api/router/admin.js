const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken")

const Show = require('../models/shows');

router.post('/addshow', [
    body("movie").notEmpty().withMessage("Movie name is required. "),
    body("date").notEmpty().withMessage("Date is required. "),
    body("timing").notEmpty().withMessage("Show timing is required. "),
    body("totalSeats").notEmpty().withMessage("Number of seats is required. "),
    body("price").notEmpty().withMessage("Price is required. "),
], async (req, res)=> {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message: 'Unauthorized'});
        }
        jwt.verify(token, "mashup_secret_key", (err, user)=> {
            if(err) {
                return res.status(403).json({message: "invalid token"});
            }
            req.user = user;
            // res.json({isAdmin: user.isAdmin})
        });
        try{
            
            if(req.user.isAdmin){
                
                var { movie, date, timing, price, totalSeats } = req.body;
                let existingShow;
                let errors = validationResult(req);
                
                if(!errors.isEmpty()){
                    let err = errors.errors.map(error =>{
                        // res.json({msg: error.msg});
                     return error.msg;
                    })
                    return res.status(400).json(err);
                }
                
                existingShow = await Show.findOne({ date: date, timing: timing});
                
                if(existingShow) {
                    
                    return res.status(400).json({message: "A show already exists at this date and time"});
                    
                }
                else{
                    let newShow = new Show({
                        movie: movie,
                        date: date,
                        timing: timing,
                        totalSeats: totalSeats,
                        price: price
                    });
                    try {
                        await newShow.save();
                        res.status(200).json({success: true, message: "Show Added"})
                        res.json({msg: "hi"})
                    } catch (error){
                        res.status(400).json({success: false, error})
                      }
                }
            }
            else{
                res.status(400).json({message: "Unauthorized User"})
            }
        }
        catch(error){
            res.status(400).json({success: false, message: "Invalid token"})
        }
    }
);

router.delete("/delete/:id", (req, res)=>{
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
    let query = {_id: req.params.id}
    Show.deleteOne(query)
    .then(()=>{
        res.status(200).json({success: true, message: "Show Deleted"})
    })
    .catch(error=>{
        res.status(400).json({success: false, error})
    })
}else{
    res.status(400).json({message: "Unauthorized User"})
}
}
catch(error){
    res.status(400).json({success: false, message: "Token expired"});
}
});

router.post("/update/:id" , async (req, res)=>{
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
    let { movie, date, timing, price, totalSeats } = req.body;
    let existingShow
    existingShow = await Show.findOne({date:date, timing: timing, _id:{$ne: req.params.id}})
    if(existingShow){
        res.status(400).json({message: "A show already exists at this date and time"})
    }else{
    let show = {
        movie: movie,
        date: date,
        timing: timing,
        price: price,
        totalSeats: totalSeats
    }
    let query = {_id: req.params.id};

    Show.updateOne(query, show)
    .then(()=>{
        res.status(200).json({success: true, message: "Show Updated"})
    })
    .catch(error=>{
        res.status(400).json({success: false, error})
    })
}
    }
    else{
        res.status(400).json({message: "Unauthorized User"})
    }
}
    catch(error){
        res.status(400).json({success: false, message: "Token expired"});
    }
});

router.post("/updateactive/:id" ,(req, res)=>{
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
    let query = {_id: req.params.id};

    Show.updateOne(query, {isActive: req.body.isActive})
    .then(()=>{
        res.status(200).json({success: true, message: "Updated"})
    })
    .catch(error=>{
        res.status(400).json({success: false, error})
    })
}else{
    res.status(400).json({message: "Unauthorized User"})
}
}
catch(error){
    res.status(400).json({success: false, message: "Token expired"});
}
});

module.exports = router;