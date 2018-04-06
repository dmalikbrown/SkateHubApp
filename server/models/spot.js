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
    rating: [ 
      {type: Number}
	],
    riskLevel: {type: Number},
    lightingLevel: {type: String},
    comment: [
      {type: String}
	]
  } , { timestamps: { createdAt: 'created_at' } });

const Spot = module.exports = mongoose.model('Spot', SpotSchema);

module.exports.getSpotById = function(id, callback){
  console.log("Finding spot, models getSpotById");
  Spot.findById(id, callback);
}

module.exports.addSpot = function(newSpot, callback){
  console.log(newSpot);
  newSpot.save(callback);
}
module.exports.editSpotAvatar = function(userId, avatarUrl, callback){
 Spot.updateMany({'userId': userId}, { $set: {'avatar': avatarUrl}}, callback);
}

/*
Update function takes in a edits object that looks like:

          edits = {
          id : id,
          type: type,
          attributeToBeEdited: newValue
        }
        edits = {
          id : spot._id,
          type: rate,
          attributeToBeEdited: rating 
		}
For reference, look more at the update function for update
user. Can be used to update ratings and comments with room 
for more
*/
module.exports.update = function(edits, callback){
  if(edits.type == "rate"){
    //Spot.findByIdAndUpdate(id, {$push: {rating: edits.rating}}, callback);  	
    Spot.findByIdAndUpdate(edits.id,
      { $push: {rating: edits.rating} },
      callback
    );
  }
  if(edits.type == "comment"){
    Spot.findByIdAndUpdate(edits.id,
      { $push: {comment: edits.comment} },
      callback
    );
  }
}
