const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Message = require('./message');
const Spot = require('./spot');
// User Schema
const UserSchema = mongoose.Schema(
  {
    fullName: {type: String, required: true, max: 100},
    username: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    password: {type: String, required: true},
    stance: {type: String, max: 100},
    spots: [
    {
              id: {type: String}
    }
    ],
    savedSpots: [
    {
              id: {type: String}
    }
    ],
    invites: [
    {
              id: {type: String}
    }
    ],
    friends: [
    {
              id: {type: String},
              sender: {type: String},
              request: {type: Boolean, default: false}
    }
    ],
    messages: [
    {
              id: {type: String}
    }
    ],
    notifications: [
    {
              id: {type: String}
    }
    ],
    avatar: {type: String, default: 'assets/imgs/profileGeneric.jpg'},
    headerImage: {type: String, default: ""}
  } , { timestamps: { createdAt: 'created_at' } });

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByEmail = function(email, callback){
  const query = {email: email}
  User.findOne(query, callback);
}
module.exports.getUserByUsername = function(username, callback){
  const query = {username: username};
  User.findOne(query, callback);
}
module.exports.getUserByQuery = function(query, callback){
  User.findOne(query, callback);
}
module.exports.addUser = function(newUser, callback){
  console.log(newUser);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePass, hash, callback){
  bcrypt.compare(candidatePass, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
module.exports.addSpot = function(id, spotId, callback){

  User.findByIdAndUpdate(id, {$push: {spots: spotId}}, callback);
}
module.exports.addInvite = function(id, inviteObj, callback){

  User.findByIdAndUpdate(id, {$push: {invites: inviteObj}}, callback);
}

module.exports.sendMessage = function(id, messageId, callback){
  console.log(messageId);
  console.log(id);
  User.findByIdAndUpdate(id, {$push: {messages: messageId}}, callback);
}

module.exports.friendRequest = function(receiver, callback){
  User.findByIdAndUpdate(receiver.sender, {$push: {friends: receiver}}, (cb) => {
    User.findByIdAndUpdate(receiver.id, {$push: {friends: receiver}}, callback);
  });
}

/*
Update function takes in a edits object that looks like:

          edits = {
          id : id,
          type: type,
          attributeToBeEdited: newValue
        }
The different edit types for now are "fullName", "username", "email",
"password", and "savedSpots" . This way we only need 1 function.
*/
module.exports.update = function(edits, callback){
  if(edits.type == "profile-info"){
    if(edits.avatar)
    User.findByIdAndUpdate(edits.id,
      { $set: {
          fullName: edits.fullName,
          username: edits.username,
          email: edits.email,
          stance: edits.stance,
          avatar: edits.avatar,
          headerImage: edits.headerImage
        }
      },
      callback
    );
  }
  else if(edits.type == "accept-request"){
    // User.update({'_id': edits.id, 'friends.id': edits.friend._id},
    //   { $set: {'friends.$.request': true}
    // },
    // callback);
    User.findById(edits.id, (err, user)=>{
       if (err) throw err;
       if(user.friends){
         console.log(user.friends);
         let index = user.friends.findIndex((friend)=> friend.sender == edits.friend._id);
         // console.log(user.friends[index]);
         user.friends[index].request = true;

         user.save((err, val) => {
           User.findById(edits.friend._id, (err, otherUser) => {
             if(err) throw err;
             if(otherUser.friends){
               let otherIndex = otherUser.friends.findIndex((friend)=> friend.sender == edits.friend._id);
               otherUser.friends[otherIndex].request = true;
               otherUser.save(callback);
             }
           });
         });
       }
    });
  }
  else if(edits.type == "password"){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(edits.newPassword, salt, (err, hash) => {
        if(err) throw err;
        User.findByIdAndUpdate(edits.id,
          { $set: {password: hash}},
          callback
        );
      });
    });
  }
  // TODO set up a way to retrieve savedSpots
  else if(edits.type == "savedSpots"){
    User.findByIdAndUpdate(edits.id,
      { $push: {savedSpots: edits.savedSpots} },
	  callback
    );
  }
  else if(edits.type == "session"){
    User.findByIdAndUpdate(edits.id,
      { $push: {invites: edits.inviteObj }}, callback);
  }
  else if(edits.type == "notification"){
    let idObj = {id: edits.notification._id};
    User.findByIdAndUpdate(edits.id,
      { $push: {notifications: idObj  }}, callback);
  }
}

module.exports.removeAccount = function(userObj, callback){
  User.findOneAndRemove({'_id': userObj.id}, (x)=>{
      Message.deleteMany({$or: [{sender: userObj.id}, {receiver: userObj.id}]}, (y)=> {
        Spot.deleteMany({userId: userObj.id}, callback);
      });
    });
// Character.deleteMany({ name: /Stark/, age: { $gte: 18 } }, function (err) {});
//     {$or:[{region: "NA"},{sector:"Some Sector"}]}
}
module.exports.removeThreads = function(messageObj, callback){
  User.updateMany({}, {
      $pull: {'messages': {id: messageObj._id}}
    }, callback);
}
