const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const multiparty = require('multiparty');
const User = require('../models/user');
const Spot = require('../models/spot');


cloudinary.config({
  cloud_name: "skatehub",
  api_key: '268764636196583',
  api_secret: 'dM_yK-fX8Vr2cPgu7srRiwLzmUA'
});
// '/skatehub/authenticate'
router.post('/authenticate', (req, res, next) => {
  console.log(req.body);
  if(req.body.username == undefined || req.body.password == undefined){
    return res.json({success: false, msg: 'Invalid Username or Password'});
  }
  let username = req.body.username.toLowerCase();
  let password = req.body.password;

  User.getUserByUsername(username, (err, user) =>{
  if(err){
    return res.json({success: false, msg: 'Invalid Username or Password'});
  }
  if(!user){
    return res.json({success: false, msg: 'Invalid Username or Password'});
  }
  else
  {
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err){
        return res.json({success: false, msg: 'Invalid Username or Password'});
      }
      if(isMatch)
      {
        let randString = "2017-11-20 23:52:291211635275399870131421393217846107168351807835241506674495890246549867007470974291162240824812535450";
        const token = jwt.sign({_id: user._id}, randString,
        {
          expiresIn: 2592000
        });
        let uObj = {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          username: user.username
        };
        return res.json({success: true, token: 'JWT '+token, user: uObj });
      }
      else
        {
          return res.json({success: false, msg: 'Invalid Username or Password'});
        }
      });
  }
  });
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
      return res.json({success: false, msg: "Error with registration, please try again."});
    }
    if(!user){
      //TODO query for email next
      User.getUserByEmail(userObj.email, (err, anotherUser) => {
        if(err){
          return res.json({success: false, msg: "Error with registration, please try again."});
        }
        if(!anotherUser){
          User.addUser(userObj, (err, retUser) =>{
            if(err){
              console.log(err);
              return res.json({success: false, msg:"Error with registration, please try again."});
            }
            else{
              console.log(retUser);
              let randString = "2017-11-20 23:52:291211635275399870131421393217846107168351807835241506674495890246549867007470974291162240824812535450";
              const token = jwt.sign({_id: retUser._id}, randString, {
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
          return res.json({success: false, msg: "That email exists already, please try another one"});
        }
      });
    }
    else{
      return res.json({success: false, msg: "That username exists already, please try another one"});
    }

  });

});

router.post('/image/upload', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  //multiparty helps handle files and large payloads
  (new multiparty.Form()).parse(req, function(err, fields, files) {
      console.log(files);
      //call the cloudinary api to upload photo
      cloudinary.uploader.upload(files.file[0].path, function (resp) {
        //return the resp from cloudinary
        return res.json({success: true, fileUrl: resp});
      });
    });
});

router.post('/spot/create', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  console.log(req.body);
  User.getUserById(req.body.id, (err,user) => {
    if(err){
      console.log(err);
      return res.json({success: false, msg:"Error when creating spot"});
    }
    if(user){
      let avatar = user.avatar;
      let spotObj = new Spot({
        avatar: avatar,
        username: user.username,
        name: req.body.name,
        userId: req.body.id,
        location: req.body.location,
        types: req.body.types,
        description: req.body.description,
        images: req.body.images,
        lightingLevel: req.body.lightingLvl,
        riskLevel: req.body.riskLvl
      });
      Spot.addSpot(spotObj, (err,spot) =>{
        if(err){
          console.log(err);
          return res.json({success: false, msg:"Error when adding spot"});
        }
        else{
          let newSpot = {
            id: spot._id
          };
          User.addSpot(user._id, newSpot, (err, x) =>{
            if(err){
              console.log(err);
              return res.json({success: false, msg:"Error when adding spot"});
            }
            else{
              return res.json({success: true});
            }
          });
        }
      });
    }
    else{
      return res.json({success: false, msg:"Error when posting"});
    }
  })

});

router.post('/image/remove', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  console.log(req.body);
  /*
  String manipulation to get the 'id' of the image for cloudinary to remove.
  */
  let url = req.body.url;
  let filename = url.substring(url.lastIndexOf('/')+1);
  console.log(filename);
  let id = filename.substring(0,filename.lastIndexOf('.'));
  console.log(id);
  //make cloudinary api call to remove photo with the particular 'id'
  cloudinary.v2.uploader.destroy(id, function(error, result){
    if(error){
      //TODO return success false or something.
    }
    else {
      return res.json({success: true});
    }
  });

});

router.get('/protected', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    return res.send({ content: 'Success'});
});
router.get('/spots/all', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    Spot.find({}, (err, spots) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error when getting spots"});
      }
      if(!spots){
          console.log(err);
          return res.json({success: false, msg:"Error when getting spots"});
      }
      else{
        return res.json({success: true, spots: spots.reverse()});
      }
    });
});
router.get('/all', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    User.find({}, (err, users) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error when getting users"});
      }
      if(!users){
          console.log(err);
          return res.json({success: false, msg:"Error when getting users"});
      }
      else{
        let l = users.length;
        for(let i = 0; i<l; i++){
          users[i].password = "";
        }
        return res.json({success: true, users: users});
      }
    });
});
router.get('/:id', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  // console.log(req.params.id);
    let id = req.params.id;
    User.getUserById(id, (err, user) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error loading"});
      }
      if(!user){
        console.log("HOW DID THIS HAPPEN? --- getting user");
        return res.json({success: false, msg:"Error loading"});
      }
      else {
        let userObj = {
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          stance: user.stance,
          spots: user.spots,
          savedSpots: user.savedSpots,
          invites: user.invites,
          friends: user.friends,
          avatar: user.avatar
        };
        return res.json({success: true, user: userObj});
      }

    });
});

module.exports = router;
