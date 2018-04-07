const mongoose = require('mongoose');
const User = require('./user');
// User Schema
const InviteSchema = mongoose.Schema(
  {
    sender: { type: String },
    spot: {type: String},
    users: [
        {
          id: { type: String }
        }
    ],
    accepted: [
      {
        id: {type: String}
      }
    ],
    declined: [
      {
        id: {type: String}
      }
    ],
    active: { type: Boolean, default: true}
  } , { timestamps: { createdAt: 'created_at' } });

const Invite = module.exports = mongoose.model('Invite', InviteSchema);

module.exports.getInviteById = function(id, callback){
  Invite.findById(id, callback);
}

module.exports.addInvite = function(newInvite, callback){
  // console.log(newMessage);
  newInvite.save(callback);
}

module.exports.addAccepted = function(inviteId, userIdObj, callback){
  Invite.findByIdAndUpdate(inviteId, {$push: {accepted: userIdObj}}, callback);
}
module.exports.addDeclined = function(inviteId, userIdObj, callback){
  Invite.findByIdAndUpdate(inviteId, {$push: {declined: userIdObj}}, callback);
}
// module.exports.pushMessage = function(id, message, callback){
//   Message.findByIdAndUpdate(id, {$push: {messages: message}}, callback);
// }


//TODO remove message threads
module.exports.deleteInvite = function(inviteObj, callback){
  // console.log("MessageObj");
  // console.log(messageObj);
  Invite.findOneAndRemove({'_id': inviteObj._id}, callback);
}
