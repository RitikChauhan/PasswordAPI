const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { JsonWebTokenError } = require('jsonwebtoken');


router.post('/app/user', (req,res,next) => {

    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    message: "Mail exists"
                });
            }
            else{
                bcrypt.hash(req.body.email, 10, (err,hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
            
                        user
                            .save()
                            .then(result => {
                                console.log(res);
                                res.status(201).json({
                                    message:'User Created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });      
            }
        })
});

router.post('/app/user/auth', (req,res,next) => {
    User.find({email: req.params.email})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password , (err,res) => {
                if(err){
                    return res.status(401).json({
                        message: 'Auth FAILED'
                    });
                }
                if(result){
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, secret, {
                        expiresIn: "1h"
                    });  
                    return res.status(200).josn({
                        message: 'Auth Successful',
                        token: token
                    })
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
        });
});


module.exports = router;

});
