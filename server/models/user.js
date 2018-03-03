const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
              id: {type: String}
    }
    ],
    messages: [
    {
              id: {type: String}
    }
    ],
    avatar: {type: String, default: 'assets/imgs/profileGeneric.jpg'}
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
  User.findByIdAndUpdate(id,{$push: {spots: spotId}}, callback);
}

module.exports.sendMessage = function(id, messageId, callback){
  console.log(messageId);
  console.log(id);
  User.findByIdAndUpdate(id, {$push: {messages: messageId}}, callback);
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
  if(edits.type == "fullName"){
    User.findByIdAndUpdate(edits.id,
      { $set: {fullName: edits.fullName} },
      callback
    );
  }
  else if(edits.type == "username"){
    User.findByIdAndUpdate(edits.id,
      { $set: {username: edits.username} },
      callback
    );
  }
  else if(edits.type == "email"){
    User.findByIdAndUpdate(edits.id,
      { $set: {email: edits.email} },
      callback
    );
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
  
}
