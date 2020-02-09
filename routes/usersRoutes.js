const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')

const { JWT_SECRET } = require('../config');

const router = express.Router();

const User = require('../models/User');

// GET ROUTES

router.get('/user', auth, (req, res) => {
    User
        .findOne({ _id: req.user.id })
        .then(user => {
            res.status(200).json(user);
        })
})

router.get('/userInfo/:userId', (req, res) => {
    User
        .findOne({ _id: req.params.userId })
        .then(user => {
            res.status(200).json(user)
        })
})



// POST ROUTES

router.post('/addUser', (req, res) => {
    const newUser = new User({
        ...req.body,
        createdTests: [],
        passedTests: []
    });

    User
        .findOne({ email: req.body.email })
        .then(foundUser => {
            if (foundUser) {
                res.status(400).json({ notSuccess: true, message: 'User already exists' });
                return;
            }
            bcrypt.genSalt(12, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    newUser.password = hash;
        
                    newUser
                        .save()
                        .then(createdUser => {
                            jwt.sign(
                                { id: newUser._id },
                                JWT_SECRET,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if(err) throw err;
                                    res.json({
                                        success: true,
                                        token,
                                        user: createdUser
                                    });
                                }
                              )
                        })
                })
            })
        })
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    
  
    // Simple validation
    if(!email || !password) {
      return res.status(400).json({ success: false, msg: 'Please enter all fields' });
    }
  
    // Check for existing user
    console.log(req.body);
    
    User.findOne({ email })
        .then(user => {
            console.log(req.body);
            if(!user) return res.status(400).json({ success: false, msg: 'User Does not exist' });

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    console.log(req.body);
                    if(!isMatch) return res.status(400).json({ success: false, doesUserExist: true, msg: 'Invalid password' });

                    jwt.sign(
                        { id: user.id },
                        JWT_SECRET,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                success: true,
                                token: token,
                                user: user
                            });
                        }
                    )
                })
    })
});


module.exports = router;