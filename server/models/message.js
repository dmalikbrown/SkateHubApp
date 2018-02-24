const mongoose = require('mongoose');
// User Schema
const MessageSchema = mongoose.Schema(
  {
    messages: [
      {
        sender: String,
        receiver: String,
        message: String
      }
    ]
  } , { timestamps: { createdAt: 'created_at' } });

const Spot = module.exports = mongoose.model('Spot', SpotSchema);

module.exports.getMessageById = function(id, callback){
  Spot.findById(id, callback);
}

module.exports.addMessage = function(newMessage, callback){
  console.log(newSpot);
  newMessage.save(callback);
}
