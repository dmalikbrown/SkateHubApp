const mongoose = require('mongoose');
const Spot = require('./spot');
const User = require('./user');
// Spot Schema
const CommentSchema = mongoose.Schema(
  {
    userId: { type: String },
    username: { type: String },
    spotId: { type: String },
    comment: [
        {type: String}
        //TODO add date sent
    ],
  } , { timestamps: { createdAt: 'created_at' } });

const Comment = module.exports = mongoose.model('Comment', CommentSchema);

module.exports.getCommentById = function(id, callback){
  Comment.findById(id, callback);
}

module.exports.addComment = function(newComment, callback){
  console.log(newComment);
  newComment.save(callback);
}

/*remove comments, can be implemented later
 * TODO add provider and route
 */
module.exports.deleteComment = function(commentObj, callback){
  console.log("commentObj");
  console.log(commentObj);
  Comment.findOneAndRemove({'_id': commentObj._id}, callback);
}
