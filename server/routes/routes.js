const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
//const config = require('../config/database');
const User = require('../models/user');

// '/skatehub/authenticate'
router.post('/authenticate', (req, res, next) => {
  console.log(req.body);
  res.json({success: true, msg: 'hello world'});
});

router.post('/register', (req, res, next) => {
  console.log(req.body);
  let userObj = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  User.getUserByUsername(userObj.username, (err, user) =>{
    if(err){
      return res.json({sucess: false, msg: "Error with registration, please try again."});
    }
    if(!user){
      //TODO query for email next
      User.getUserByEmail(userObj.email, (err, anotherUser) => {
        if(err){
          return res.json({sucess: false, msg: "Error with registration, please try again."});
        }
        if(!anotherUser){
          User.addUser(userObj, (err, retUser) =>{
            if(err){
              console.log(err);
              return res.json({success: false, msg:"Error with registration, please try again."});
            }
            else{
              console.log(retUser);
              let randString = "2017-11-20 23:52:291211635275399870131421393217846107168351807835241506674495890246549867007470974291162240824812535450"
              const token = jwt.sign({id: retUser._id}, randString, {
                expiresIn: 2592000// 30 days in seconds
              });
              let uObj = {
                id: retUser._id,
                fullName: retUser.fullName,
                email: retUser.email,
                username: retUser.username
              };
              return res.json({success: true, token: 'JWT '+token, user: uObj });
            }
          });
        }
        else{
          return res.json({sucess: false, msg: "That email exists already, please try another one"});
        }
      });
    }
    else{
      return res.json({sucess: false, msg: "That username exists already, please try another one"});
    }

  });

});

router.get('/protected', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    return res.send({ content: 'Success'});
});

module.exports = router;
