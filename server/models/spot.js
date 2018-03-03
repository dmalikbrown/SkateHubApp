const mongoose = require('mongoose');
// User Schema
const SpotSchema = mongoose.Schema(
  {
    name: {type: String, required: true, max: 100},
    location: {type: String, required: true},
    types: [{type: String}],
    description: {type: String},
    userId: {type: String},
    avatar: {type: String},
    username: {type: String},
    images: [{type: String}],
    rating: {type: Number},
    riskLevel: {type: Number},
    lightingLevel: {type: String}
  } , { timestamps: { createdAt: 'created_at' } });

const Spot = module.exports = mongoose.model('Spot', SpotSchema);

module.exports.getSpotById = function(id, callback){
  Spot.findById(id, callback);
}

module.exports.addSpot = function(newSpot, callback){
  console.log(newSpot);
  newSpot.save(callback);
}
module.exports.editSpotAvatar = function(spot, avatarUrl, callback){
 Spot.findByIdAndUpdate(spot.id, { $set: {'avatar': avatarUrl}, callback});
}
