const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const Show = require('../models/shows');

router.post('book/:id', [
    body('user_email'.notEmpty().withMessage('User Email is required'))
], async (req, res)=>{
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
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        let err = errors.errors.map(error =>{
        return error.msg;
        })
        return res.status(400).json(err);
    }
    var { movie, date, timing, totalPriceprice, totalSeats } = req.body;
    let existingShow;
    existingShow = await Show.findOne({ date: date, timing: timing});
    if(!existingShow){
        return res.status(400).json({message: "Show is not found"});
    }
    if(totalSeats < 0){
        return res.status(400).json({success: false, message: "Not enough tickets left"})
    }
    let totalSeats = existingShow.totalSeats - tickets;
    let booking = new Booking({
        movie: existingShow.movie,
        date: existingShow.date,
        timing: existingShow.timing,
        tickets: tickets,
        totalPrice: totalPrice,
        user_id: user_id,
        user_email: user_email
    })
    booking.save()
    .then(()=> {
        //mail to the user
    })
    .catch((error)=> {
        return res.status(400).json({success: false, message: "Booked"})
    })
})