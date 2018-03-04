const mongoose = require('mongoose');
const User = require('./user');
// User Schema
const MessageSchema = mongoose.Schema(
  {
    sender: { type: String },
    receiver: { type: String },
    messages: [
      {
        sender: {type: String},
        receiver: {type: String},
        message: {type: String}
        //TODO add date sent
      }
    ]
  } , { timestamps: { createdAt: 'created_at' } });

const Message = module.exports = mongoose.model('Message', MessageSchema);

module.exports.getMessageById = function(id, callback){
  Message.findById(id, callback);
}

module.exports.addMessage = function(newMessage, callback){
  console.log(newMessage);
  newMessage.save(callback);
}

module.exports.pushMessage = function(id, message, callback){
  Message.findByIdAndUpdate(id, {$push: {messages: message}}, callback);
}


//TODO remove message threads
module.exports.deleteMessage = function(messageObj, callback){
  console.log("MessageObj");
  console.log(messageObj);
  Message.findOneAndRemove({'_id': messageObj._id}, callback);
}
