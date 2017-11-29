const mongoose = require('mongoose');
// User Schema
const SpotSchema = mongoose.Schema(
  {
    name: {type: String, required: true, max: 100},
    location: {type: String, required: true},
    types: [{type: String}],
    desciption: {type: String},
    avatar: {type: String},
    images: [{type: String}],
    rating: {type: Number},
    riskLevel: {type: String},
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
