const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const multiparty = require('multiparty');
const User = require('../models/user');
const Spot = require('../models/spot');
const Message = require('../models/message');
const Invite = require('../models/invite');
const Comment = require('../models/comment');
const Report = require('../models/report');
const Notification = require('../models/notification');


cloudinary.config({
  cloud_name: "skatehub",
  api_key: '268764636196583',
  api_secret: 'dM_yK-fX8Vr2cPgu7srRiwLzmUA'
});
// '/skatehub/authenticate'
router.post('/authenticate', (req, res, next) => {
  console.log(req.body);
  if(req.body.username == undefined || req.body.password == undefined){
    return res.json({success: false, msg: 'Invalid Username or Password'});
  }
  let username = req.body.username.toLowerCase();
  let password = req.body.password;

  User.getUserByUsername(username, (err, user) =>{
  if(err){
    return res.json({success: false, msg: 'Invalid Username or Password'});
  }
  if(!user){
    return res.json({success: false, msg: 'Invalid Username or Password'});
  }
  else
  {
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err){
        return res.json({success: false, msg: 'Invalid Username or Password'});
      }
      if(isMatch)
      {
        let randString = "2017-11-20 23:52:291211635275399870131421393217846107168351807835241506674495890246549867007470974291162240824812535450";
        const token = jwt.sign({_id: user._id}, randString,
        {
          expiresIn: 2592000
        });
        let userObj = {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          stance: user.stance,
          spots: user.spots,
          savedSpots: user.savedSpots,
          invites: user.invites,
          friends: user.friends,
          avatar: user.avatar,
          messages: user.messages,
          notifications: user.notifications,
          headerImage: user.headerImage
        };
        return res.json({success: true, token: 'JWT '+token, user: userObj });
      }
      else
        {
          return res.json({success: false, msg: 'Invalid Username or Password'});
        }
      });
  }
  });
});

router.post('/register', (req, res, next) => {
  console.log(req.body);
  let userObj = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  User.getUserByUsername(userObj.username, (err, user) =>{
    if(err){
      return res.json({success: false, msg: "Error with registration, please try again."});
    }
    if(!user){
      //TODO query for email next
      User.getUserByEmail(userObj.email, (err, anotherUser) => {
        if(err){
          return res.json({success: false, msg: "Error with registration, please try again."});
        }
        if(!anotherUser){
          User.addUser(userObj, (err, retUser) =>{
            if(err){
              console.log(err);
              return res.json({success: false, msg:"Error with registration, please try again."});
            }
            else{
              console.log(retUser);
              let randString = "2017-11-20 23:52:291211635275399870131421393217846107168351807835241506674495890246549867007470974291162240824812535450";
              const token = jwt.sign({_id: retUser._id}, randString, {
                expiresIn: 2592000// 30 days in seconds
              });
              let userObj = {
                _id: retUser._id,
                fullName: retUser.fullName,
                username: retUser.username,
                email: retUser.email,
                stance: retUser.stance,
                spots: retUser.spots,
                savedSpots: retUser.savedSpots,
                invites: retUser.invites,
                friends: retUser.friends,
                avatar: retUser.avatar,
                messages: retUser.messages,
                notifications: retUser.notifications,
                headerImage: retUser.headerImage
              };
              return res.json({success: true, token: 'JWT '+token, user: userObj });
            }
          });
        }
        else{
          return res.json({success: false, msg: "That email exists already, please try another one"});
        }
      });
    }
    else{
      return res.json({success: false, msg: "That username exists already, please try another one"});
    }

  });

});
router.post('/delete', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  console.log(req.body);
  User.removeAccount(req.body, (err, val) => {
    if(err){
      return res.json({success: false, msg: 'Failed to delete account. Try again.'});
    }
    else {
      return res.json({success: true, msg: 'Account removed!'});
    }
  });
});
router.post('/create/invite', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  console.log(req.body);
  let newInvite = new Invite(req.body);
  Invite.addInvite(newInvite, (err, invite) => {
    if(err){
      return res.json({success: false, msg: 'Failed to create invite. Try again.'});
    }
    else {
      let inviteObj = {
        id: invite._id
      };
      User.addInvite(invite.sender, inviteObj, (err, val) => {
        if(err){
          return res.json({success: false, msg: 'Failed to create invite. Try again.'});
        }
        else {
          return res.json({success: true, invite: invite});
        }
      });
    }
  });
});
router.post('/add/invites', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let inviteObj = req.body;
  let userInviteObj = {
    id: inviteObj.inviteId
  };

  User.addInvite(inviteObj.userId, userInviteObj, (err, someVal)=> {
    if(err){
      return res.json({success: false, msg: 'Failed to create invite. Try again.'});
    }
    else {
      return res.json({success: true});
    }
  });
});
router.post('/accept/invite', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let inviteObj = req.body;

  Invite.addAccepted(inviteObj.inviteId, inviteObj.userId, (err, someVal)=> {
    if(err){
      return res.json({success: false, msg: 'Failed to accept invite. Try again.'});
    }
    else {
      return res.json({success: true});
    }
  });
});
router.post('/decline/invite', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let inviteObj = req.body;

  Invite.addDeclined(inviteObj.inviteId, inviteObj.userId, (err, someVal)=> {
    if(err){
      return res.json({success: false, msg: 'Failed to decline invite. Try again.'});
    }
    else {
      return res.json({success: true});
    }
  });
});
router.post('/image/upload', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  //multiparty helps handle files and large payloads
  (new multiparty.Form()).parse(req, function(err, fields, files) {
      console.log(files);
      //call the cloudinary api to upload photo
      cloudinary.uploader.upload(files.file[0].path, function (resp) {
        //return the resp from cloudinary
        return res.json({success: true, fileUrl: resp});
      });
    });
});
// router.post('/avatar/upload', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
//   (new multiparty.Form()).parse(req, function(err, fields, files) {
//       console.log(fields);
//       User.getUserById(fields.id[0].toLowerCase(), (err, user) =>{
//         if(err){
//           console.log(err);
//           return res.json({success: false, msg: "Failed to upload avatar"});
//         }
//         if(!user){
//             return res.json({success: false, msg: "Failed to upload avatar"});
//         }
//         else{
//
//           cloudinary.uploader.upload(files.file[0].path, function (resp) {
//             //console.log(fields.user);
//             let avatarUrl = resp.url;
            // let edits = {
            //   id: user._id,
            //   type: "avatar",
            //   avatar: avatarUrl
            // };
//             User.update(edits, (err, x) =>{
//               if(err){
//                 console.log(err);
//                 return res.json({success: false, msg: "Failed to upload avatar"});
//               }
//               else{
//                 let len = user.spots.length;
//                 for(let i = 0; i<len; i++){
//                   Spot.editSpotAvatar(user.spots[i], avatarUrl, (err, y) => {
//                     if(err){
//                       console.log("ALEX: ERROR EDIT Spot Avatar: "+ err.toString());
//                       return res.json({success: false, msg: "Error editing avatar."});
//                     }
//                   });
//                 }
//                 return res.json({success: true});
//               }
//             });
//           });
//         }
//       });
//
//     });
//
// });

router.post('/spot/create', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  console.log(req.body);
  User.getUserById(req.body.id, (err,user) => {
    if(err){
      console.log(err);
      return res.json({success: false, msg:"Error when creating spot"});
    }
    if(user){
      let avatar = user.avatar;
      let spotObj = new Spot({
        avatar: avatar,
        username: user.username,
        name: req.body.name,
        userId: req.body.id,
        location: req.body.location,
        types: req.body.types,
        description: req.body.description,
        images: req.body.images,
        lightingLevel: req.body.lightingLvl,
        riskLevel: req.body.riskLvl,
        coordinates: req.body.coordinates
      });
      Spot.addSpot(spotObj, (err,spot) =>{
        if(err){
          console.log(err);
          return res.json({success: false, msg:"Error when adding spot"});
        }
        else{
          let newSpot = {
            id: spot._id
          };
          User.addSpot(user._id, newSpot, (err, x) =>{
            if(err){
              console.log(err);
              return res.json({success: false, msg:"Error when adding spot"});
            }
            else{
              return res.json({success: true});
            }
          });
        }
      });
    }
    else{
      return res.json({success: false, msg:"Error when posting"});
    }
  })

});

router.post('/spot/delete', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  Spot.deleteSpot(req.body, (err, val) => {
    if(err){
      console.log(err);
      return res.json({success: false, msg:"Error when deleting"});
    }
    else {
      User.updateMany({}, {
        $pull: {'savedSpots': {id: req.body._id},
         'spots': {id: req.body._id}}
      }, { multi: true }, (err, x) =>{
        if(err){
          console.log(err);
          return res.json({success: false, msg:"Error when deleting"});

        }
        else {
          Comment.deleteMany({spotId: req.body._id}, (y)=> {
            if(err){
              console.log(err);
              return res.json({success: false, msg:"Error when deleting"});
            }
            else {
              return res.json({success: true, msg:"Deleted"});
              // Notification.deleteMany({obj: spot._id}, (err, z) => {
              //   if(err){
              //     console.log(err);
              //     return res.json({success: false, msg:"Error when deleting"});
              //   }
              //   else {
              //     return res.json({success: false, msg:"Error when deleting"});
              //   }
              // });
            }
          });
        }


      });
    }
  });
});

/*
 * This route allows comments to be stored.
 * I thought that maybe it should be stored
 * within a subdivision of spot but since comments
 * has it's own schema. An executive decison was
 * made.
 */
router.post('/comment', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  console.log(req.body);

  let commentObj = new Comment({
    userId: req.body.userId,
	username: req.body.username,
    spotId: req.body.spotId,
    comment: req.body.comment
  });
  Comment.addComment(commentObj, (err,comment) =>{
    if(err){
      console.log(err);
      return res.json({success: false, msg:"Error when adding comment"});
    }
    else{
      return res.json({success: true, comment: comment});
    }
  });
});
/*
 * This allows us to save reports submitted by the user.
 *
 */
router.post('/report', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  console.log(req.body);

  let reportObj = new Report({
    userId: req.body.userId,
    spotId: req.body.spotId,
    report: req.body.report
  });
  Report.addReport(reportObj, (err,report) =>{
    if(err){
      console.log(err);
      return res.json({success: false, msg:"Error when adding report"});
    }
    else{
      return res.json({success: true, report});
    }
  });
});


/*
 * The 'update' route is going to be called when a user is editing any information
 * pertaining to a spot. Can be used the same way as updating a user.
 */

router.post('/spot/update', passport.authenticate('jwt', {session:false}), (req, res, next) => {

  console.log(req.body);
  if(req.body.type == "rate"){
    Spot.update(req.body, (err, x) => {
      if(err){
        console.log(err);
        return res.json({success: false, msg: "Error saving rating to spot"});
      }
      else {
        return res.json({success: true, msg: "Saved spot rating!"});
      }
    });
  }
  if(req.body.type == "comment"){
        Spot.update(req.body, (err, x) => {
          if(err){
            console.log(err);
            return res.json({success: false, msg: "Error saving comment id to spot"});
          }
          else {
            return res.json({success: true, msg: "Saved spot comment id!"});
          }
        });
      }

});

router.post('/image/remove', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  console.log(req.body);
  /*
  String manipulation to get the 'id' of the image for cloudinary to remove.
  */
  let url = req.body.url;
  let filename = url.substring(url.lastIndexOf('/')+1);
  console.log(filename);
  let id = filename.substring(0,filename.lastIndexOf('.'));
  console.log(id);
  //make cloudinary api call to remove photo with the particular 'id'
  cloudinary.v2.uploader.destroy(id, function(error, result){
    if(error){
      //TODO return success false or something.
    }
    else {
      return res.json({success: true});
    }
  });

});

/*
The 'comp_pass' route is going to be called when a user is typing in their old
password. The route hashes the input and compares it to the user's password hash.
If the hashes match, then we return success true to the app.
*/

router.post('/comp_pass', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  console.log(req.body);

  //grab the user object
  User.getUserById(req.body.id, (err, user) =>{
  if(err){
    return res.json({success: false});
  }
  if(!user){
    return res.json({success: false});
  }
  else
  {
    //use the comparePassword function to hash the input password and compare
    //the hashes. Database returns a isMatch value that's a boolean
    User.comparePassword(req.body.password, user.password, (err, isMatch) => {
      if(err){
        return res.json({success: false});
      }
      if(isMatch)
      {
        //passwords match, let the app know it was successful
        return res.json({success: true});
      }
      else
        {
          return res.json({success: false});
        }
      });
  }
  });
});

router.post('/friend', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  console.log(req.body);
  let id = req.body.id;
  let recipients = req.body.recipients;
  let length = recipients.length;
  // let senderObj = {
  //   sender: id,
  //   id: id,
  //   request: false
  // };
  for (let i = 0; i < length; i++) {
      let friendObj = {
        sender: id,
        id: recipients[i]._id,
        request: false
      };
      User.friendRequest(friendObj, (err, someval) => {
        if(err){
          return res.json({success: false, msg: "Error Sending friend Request"});
        }
        else{
          return res.json({success: true});
        }
      });

  }

});

/*
The 'update' route is going to be called when a user is editing any of their
information. For now the route is set up to handle "fullName", "username",
"email", and "password" edits. Attached to the req.body is a type attribute
that dictates what the user is trying to edit.
*/
router.post('/update', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  console.log("Update");
  console.log(req.body);
  if(req.body.type == "profile-info"){
    User.update(req.body, (err, x) => {
      if(err){
        console.log(err);
        return res.json({success: false, msg: "Error editing info!"});
      }
      else {
        return res.json({success: true, msg: "Saved profile info!"});
      }
    });
  }
  if(req.body.type == "accept-request"){
    User.update(req.body, (err, x) => {
      if(err){
        console.log(err);
        return res.json({success: false, msg: "Error accepting request"});
      }
      else {
        return res.json({success: true, msg: "Accepted request!"});
      }
    });
  }
  // if(req.body.type == "avatar"){
  //   User.update(req.body, (err, x) => {
  //     if(err){
  //       console.log(err);
  //       return res.json({success: false, msg: "Error editing avatar"});
  //     }
  //     else {
  //       Spot.editSpotAvatar(req.body.id, req.body.avatar, (err, y) => {
  //         if(err){
  //           console.log("ALEX: ERROR EDIT Spot Avatar: "+ err.toString());
  //           return res.json({success: false, msg: "Error editing avatar."});
  //         }
  //         else {
  //           return res.json({success: true, msg: "Edited avatar!"});
  //         }
  //       });
  //     }
  //   });
  // }
  // if(req.body.type == "username"){
  //   //Gotta check if the username exists already
  //   User.getUserByUsername(req.body.username, (err, user) => {
  //     if(err){
  //       console.log(err);
  //       return res.json({success: false, msg: "Error editing username"});
  //     }
  //     if(user){
  //       return res.json({success: false, msg: "That username already exists!"});
  //     }
  //     else {
  //       User.update(req.body, (err, x) => {
  //         if(err){
  //           console.log(err);
  //           return res.json({success: false, msg: "Error editing username"});
  //         }
  //         else {
  //           return res.json({success: true, msg: "Edited username!"});
  //         }
  //       });
  //     }
  //   });
  // }
  // if(req.body.type == "email"){
  //   //Gotta check if the email already exists
  //   User.getUserByEmail(req.body.email, (err, user) => {
  //     if(err){
  //       console.log(err);
  //       return res.json({success: false, msg: "Error editing email"});
  //     }
  //     if(user){
  //       return res.json({success: false, msg: "That email already exists!"});
  //     }
  //     else {
  //       User.update(req.body, (err, x) => {
  //         if(err){
  //           console.log(err);
  //           return res.json({success: false, msg: "Error editing email"});
  //         }
  //         else {
  //           return res.json({success: true, msg: "Edited email!"});
  //         }
  //       });
  //     }
  //   });
  // }
  if(req.body.type == 'password'){
    User.update(req.body, (err, x) => {
      if(err){
        console.log(err);
        return res.json({success: false, msg: "Error editing password!"});
      }
      else {
        return res.json({success: true, msg: "Edited password!"});
      }
    });
  }
  if(req.body.type == 'savedSpots'){
    User.update(req.body, (err, x) => {
      if(err){
        console.log(err);
        return res.json({success: false, msg: "routes: Error saving spot!"});
      }
      else {
        return res.json({success: true, msg: "routes: Saved spot!"});
      }
    });
  }
  // if(req.body.type == 'stance'){
  //   User.update(req.body, (err, x) => {
  //     if(err){
  //       console.log(err);
  //       return res.json({success: false, msg: "routes: Error setting stance!"});
  //     }
  //     else {
  //       return res.json({success: true, msg: "routes: Set stance!"});
  //     }
  //   });
  // }
  if(req.body.type == 'session'){
    User.update(req.body, (err, x) => {
      if(err){
        console.log(err);
        return res.json({success: false, msg: "routes: Error setting stance!"});
      }
      else {
        return res.json({success: true, msg: "routes: Set stance!"});
      }
    });
  }
  if(req.body.type == 'notification'){
    console.log(req.body.notification);
    let notification = new Notification(req.body.notification);
    Notification.addNotification(notification, (err, newNot) => {
      if(err){
        console.log(err);
        return res.json({success: false, msg: "error saving notification"});
      }
      else {
        req.body.notification = newNot;
        console.log("NEW REQ BODY");
        console.log(req.body);
        User.update(req.body, (err, x) => {
          if(err){
            console.log(err);
            return res.json({success: false, msg: "error saving notification to user"});
          }
          else {
            return res.json({success: true});
          }
        })
      }
    });
  }
});

router.post('/message', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  if(req.body.threadId !=''){
    console.log(req.body);
    Message.pushMessage(req.body.threadId, req.body.messages[0], (err, x) => {
      if(err){
        console.log(err);
        return res.json({success: false, msg: "Error sending message"});
      }
      else {
        return res.json({success: true, msg: "Message sent!"});
      }
    });
  }
  else {
      let newMessage = new Message(req.body);
      let messageIdObj = {
        id: newMessage._id.toString()
      };
      User.sendMessage(req.body.sender, messageIdObj, (err, someVar) => {
        console.log("Calling back");
        if(err){
          console.log(err);
          return res.json({success: false, msg: "Error sending message"})
        }
        else {
          console.log("Here");
          User.sendMessage(req.body.receiver, messageIdObj, (err, aVar) => {
            if(err){
              return res.json({success: false, msg: "Error sending message"})
            }
            else {
              Message.addMessage(newMessage, (err, newMsgObj) => {
                if(err){
                  return res.json({success: false, msg: "Error sending message"})
                }
                else {
                  return res.json({success: true, msg: "Message sent!", newThread: newMsgObj});
                }
              });
            }
          });
        }
      });
  }


  //TODO account for already created threads

});


router.post('/message', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  if(req.body.threadId !=''){
    console.log(req.body);
    Message.pushMessage(req.body.threadId, req.body.messages[0], (err, x) => {
      if(err){
        console.log(err);
        return res.json({success: false, msg: "Error sending message"});
      }
      else {
        return res.json({success: true, msg: "Message sent!"});
      }
    });
  }
  else {
      let newMessage = new Message(req.body);
      let messageIdObj = {
        id: newMessage._id.toString()
      };
      User.sendMessage(req.body.sender, messageIdObj, (err, someVar) => {
        console.log("Calling back");
        if(err){
          console.log(err);
          return res.json({success: false, msg: "Error sending message"})
        }
        else {
          console.log("Here");
          User.sendMessage(req.body.receiver, messageIdObj, (err, aVar) => {
            if(err){
              return res.json({success: false, msg: "Error sending message"})
            }
            else {
              Message.addMessage(newMessage, (err, newMsgObj) => {
                if(err){
                  return res.json({success: false, msg: "Error sending message"})
                }
                else {
                  return res.json({success: true, msg: "Message sent!"});
                }
              });
            }
          });
        }
      });
  }


  //TODO account for already created threads

});

router.post('/delete/message', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  console.log(req.body);
  Message.deleteMessage(req.body, (err, x) => {
    if(err){
      console.log(err);
      return res.json({success: false, msg: 'Failed to delete messages. Please try again.'});
    }
    else {
      User.removeThreads(req.body, (err, somval) => {
        if(err){
          console.log(err);
          return res.json({success: false, msg: 'Failed to delete messages. Please try again.'});
        }
        else {
            return res.json({success: true, msg: 'Messages have been removed!'});
        }
      });

    }
  });
});

router.get('/message/:threadId', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  let id = req.params.threadId;
  console.log(req.params.threadId);
  Message.getMessageById(id, (err, thread) => {
    if(err) {
      return res.json({success: false, msg: "Error getting thread"});
    }
    else {
      return res.json({success: true, thread: thread});
    }
  })
});

router.get('/invite/:inviteId', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  let id = req.params.inviteId;
  // console.log(req.params.threadId);
  Invite.getInviteById(id, (err, invite) => {
    if(err) {
      return res.json({success: false, msg: "Error getting invite"});
    }
    else {
      return res.json({success: true, invite: invite});
    }
  })
});
router.get('/protected', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    return res.send({ content: 'Success'});
});
router.get('/comments/spots/all/:id', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    Comment.find({spotId: req.params.id}, (err, comment) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error when getting all comments"});
      }
      if(!comment){
          console.log(err);
          return res.json({success: false, msg:"Error when getting all comments"});
      }
      else{
        return res.json({success: true, comment: comment});
      }
    });
});

router.get('/spots/user/:id', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    Spot.find({userId: req.params.id}, (err, spots) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error when getting spots"});
      }
      if(!spots){
          console.log(err);
          return res.json({success: false, msg:"Error when getting spots"});
      }
      else{
        return res.json({success: true, spots: spots.reverse()});
      }
    });
});

router.get('/spots/saved/:id', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    User.getUserById(req.params.id, (err, user) => {
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error when getting spots"});
      }
      else if(user) {
        let savedArr = user.savedSpots.map(spot => spot.id);
        Spot.find({_id: {$in: savedArr}}, (err, spots) =>{
          if(err){
            console.log(err);
            return res.json({success: false, msg:"Error when getting spots"});
          }
          if(!spots){
              console.log(err);
              return res.json({success: false, msg:"Error when getting spots"});
          }
          else{
            return res.json({success: true, spots: spots.reverse()});
          }
        });
      }
      else {
        console.log("user didn't exist");
        return res.json({success: false, msg:"Error when getting spots"});
      }
    });
});

// {_id: {$in: [req.body.data]}

router.get('/spots/all', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    Spot.find({}, (err, spots) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error when getting spots"});
      }
      if(!spots){
          console.log(err);
          return res.json({success: false, msg:"Error when getting spots"});
      }
      else{
        return res.json({success: true, spots: spots.reverse()});
      }
    });
});
router.get('/invites/all', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    Invite.find({}, (err, invites) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error when getting invites"});
      }
      if(!invites){
          console.log(err);
          return res.json({success: false, msg:"Error when getting invites"});
      }
      else{
        return res.json({success: true, invites: invites});
      }
    });
});

router.get('/notifications/:id', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    Notification.find({receiver: req.params.id}, (err, notifications) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error when getting notifications"});
      }
      if(!notifications){
          console.log(err);
          return res.json({success: false, msg:"Error when getting notifications"});
      }
      else{
        return res.json({success: true, notifications: notifications});
      }
    });
});
router.get('/all', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
    User.find({}, (err, users) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error when getting users"});
      }
      if(!users){
          console.log(err);
          return res.json({success: false, msg:"Error when getting users"});
      }
      else{
        let l = users.length;
        for(let i = 0; i<l; i++){
          users[i].password = "";
        }
        return res.json({success: true, users: users});
      }
    });
});
router.get('/spots/:id', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  // console.log(req.params.id);
    let id = req.params.id;
    Spot.getSpotById(id, (err, spot) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error loading Spot"});
      }
      if(!spot){
        console.log("HOW DID THIS HAPPEN? --- getting Spot");
        return res.json({success: false, msg:"Error loading"});
      }
      else {

        return res.json({success: true, spot: spot});
      }
    });
});
/*
 * This allows us to get the comments by id. If we wanted to.
 * What is returned is all the info pertaining to that comment.
 */
router.get('/comment/:id', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  // console.log(req.params.id);
    let id = req.params.id;
    Comment.getCommentById(id, (err, comment) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error loading comment"});
      }
      if(!comment){
        console.log("HOW DID THIS HAPPEN? --- getting Comment");
        return res.json({success: false, msg:"Error loading"});
      }
      else {

      let commentObj = {

        _id: comment._id,
        userId: comment.userId,
    		username: comment.username,
        spotId: comment.spotId,
        comment: comment.comment
       };
        return res.json({success: true, comment: commentObj});
      }
    });
});
router.get('/report/:id', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  // console.log(req.params.id);
    let id = req.params.id;
    Report.getReportById(id, (err, report) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error loading report"});
      }
      if(!report){
        console.log("HOW DID THIS HAPPEN? --- getting Report");
        return res.json({success: false, msg:"Error loading"});
      }
      else {

      let reportObj = {
        _id: report._id,
        userId: report.userId,
        spotId: report.spotId,
        report: report.report
       };
        return res.json({success: true, report: reportObj});
      }
    });
});
router.get('/:id', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  // console.log(req.params.id);
    let id = req.params.id;
    User.getUserById(id, (err, user) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error loading"});      }
      if(!user){
        console.log("HOW DID THIS HAPPEN? --- getting user");
        return res.json({success: false, msg:"Error loading"});
      }
      else {
        let userObj = {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          stance: user.stance,
          spots: user.spots,
          savedSpots: user.savedSpots,
          invites: user.invites,
          friends: user.friends,
          avatar: user.avatar,
          messages: user.messages,
          notifications: user.notifications,
          headerImage: user.headerImage
        };
        return res.json({success: true, user: userObj});
      }

    });
});
router.get('/query/:key/:value', passport.authenticate('jwt', {session:false}) ,(req, res, next) =>{
  // console.log(req.params.id);
    let query = {};
    query[req.params.key] = req.params.value;
    console.log("QUERY");
    console.log(query);
    User.getUserByQuery(query, (err, user) =>{
      if(err){
        console.log(err);
        return res.json({success: false, msg:"Error loading"});      }
      if(!user){
        console.log("HOW DID THIS HAPPEN? --- getting user");
        return res.json({success: true, msg:"User doesn't exist"});
      }
      else {
        let userObj = {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          stance: user.stance,
          spots: user.spots,
          savedSpots: user.savedSpots,
          invites: user.invites,
          friends: user.friends,
          avatar: user.avatar,
          messages: user.messages,
          notifications: user.notifications
        };
        return res.json({success: true, user: userObj});
      }

    });
});

module.exports = router;
