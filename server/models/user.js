const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// User Schema
const UserSchema = mongoose.Schema(
  {
    name: {type: String, required: true, max: 100},
    username: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    password: {type: String, required: true},
    phoneNumber: {type: String, required: true, max: 100},
    stance: {type: String, max: 100},
    spots: [{type: String}],
    savedSpots: [{type: String}],
    invites: [{type: String}],
    friends: [{type: String}],
    avatar: {type: String}
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
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}