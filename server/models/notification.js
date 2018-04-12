const mongoose = require('mongoose');

// Notification Schema
const NotificationSchema = mongoose.Schema(
  {
    type: {type: String},
    description: {type: String},
    sender: {type: String},
    receiver: {type: String},
    obj: {type: String} //the obj that the notification surrounds

  } , { timestamps: { createdAt: 'created_at' } });

const Notification = module.exports = mongoose.model('Notification', NotificationSchema);

module.exports.getNotificationById = function(id, callback){
  Notification.findById(id, callback);
}
module.exports.addNotification = function(newNotification, callback){
  newNotification.save(callback);
}
