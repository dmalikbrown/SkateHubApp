import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,
  ToastController} from 'ionic-angular';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { AuthProvider } from './../../providers/auth/auth';
import { OtherUserSpotsPage } from '../../pages/other-user-spots/other-user-spots';
import { OtherFriendsPage } from './../../pages/other-friends/other-friends';
import { SpotsProvider } from './../../providers/spots/spots';


/**
 * Similar to DetailedSpotPage. Displays useful information pertaining
 * to the selected user.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailed-user',
  templateUrl: 'detailed-user.html',
})
export class DetailedUserPage {
  user: any;
  userId: any;
  spots: any = [];
  id: any;
  spotsArr: any = [];
  me: any;
  hasRequested: boolean = false;
  theyRequested: boolean = false;
  isFriends: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public authProvider: AuthProvider, public spotsProvider: SpotsProvider,
    public toastCtrl: ToastController, public oneSignal: OneSignal) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad DetailedUserPage');
  }



  /*
  * Checks to see if the navParams are given. Doesn't check anything.
  * TODO implement some checks
  */
  ionViewDidEnter(){
    this.authProvider.loadUser();
    this.getInfo();
    // console.log(this.me);


  }
  getInfo(){
    this.authProvider.getUser(this.authProvider.user._id).subscribe((data)=> {
      if(data.success){
        this.me = data.user;
        this.authProvider.updateUser(data.user);
        this.userId = this.navParams.get('id');
        // console.log("outside of if statement, ionViewDidEnter");
        this.getUser(this.userId);
      }
      else {
        console.log(data.msg);
      }
    });
  }

  /*

  * Gets the user from the server.
  * Can be used to get more info from the user,
  * or the spots that the user has authored.

  */
  getUser(id){
    this.authProvider.getUser(id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
         this.user = data.user;
         // console.log(this.user);
         this.checkFriends();
        //this.spots = this.user.spots;
        this.spotsProvider.getAllSpots().subscribe((data) => {
          if (data.success) {
            for (const spot of data.spots) {
              if (spot.userId == this.navParams.data.id) {
                this.spotsArr.push(spot);
                // console.log("++++++++++++", spot.userId, this.navParams.data.id);
              }
            }
          }
        });
      } else {
          console.log("Error: DetailedUserPage, failed UserId");
      }
     });

  }

  checkFriends(){
    if(this.me.friends){
      // console.log("here bitch");
      console.log(this.me.friends);
      let theirIndex = this.me.friends.findIndex(friend => friend.id == this.user._id || friend.sender == this.user._id);
      let myIndex = this.user.friends.findIndex(friend => friend.sender == this.me._id || friend.id == this.me._id);
      console.log("their index is: "+theirIndex);
      console.log("my index is: "+myIndex);
      if(theirIndex > -1 && myIndex > -1){
        if(!this.me.friends[theirIndex].request && !this.user.friends[myIndex].request &&
                this.me.friends[theirIndex].sender == this.me._id){
                  console.log("I've requested?");
                  this.hasRequested = true;
        }
        else if(!this.me.friends[theirIndex].request && !this.user.friends[myIndex].request &&
                this.user.friends[myIndex].sender == this.user._id){
                  console.log("They sent me a request");
                  this.theyRequested = true;
        }
        else if(this.me.friends[theirIndex].request && this.user.friends[myIndex].request){
          console.log("we're friends");
          this.isFriends = true;
        }
      }
      else {
        console.log("Neither have requested");
        this.hasRequested = false;
      }
    }


  }

  spotsPage(){
    this.navCtrl.push(OtherUserSpotsPage, {spots: this.spotsArr, user: this.user});
  }

  friendsPage(){
    this.navCtrl.push(OtherFriendsPage, {user: this.user});
  }

  addFriend(){
    //TODO attach an id obj if there's already a thread made
    this.authProvider.loadUser();
    let id = this.authProvider.user._id;
    let recipients = [];
    recipients.push(this.user);
    let friendObj = {
      id: id,
      recipients: recipients
    };
    this.authProvider.friendRequest(friendObj).subscribe((data) => {
      if(data.success){
          this.hasRequested = true;
          this.getInfo();
          console.log("Success");
          let toast = this.toastCtrl.create({
            message: "Successfully sent friend request",
            position: "top",
            showCloseButton: true,
            dismissOnPageChange: true
          });
          toast.present().then(() => {
            setTimeout(() => {
              toast.dismiss();
            }, 2000);
          });
          this.authProvider.getOneSignalDevices().subscribe((results) => {
            // console.log(results);
            // console.log("RECEIPIENT");
            // console.log(recipient);
            let len = results.total_count;
            // let recLen = this.selectedUsers.length;

            let destinationIds = [];
            for(let i = 0; i<len; i++){
              if(results.players[i].tags.user_id == recipients[0]._id){
                destinationIds.push(results.players[i].id);
                break;
              }
            }

            //TODO send notification
            console.log(destinationIds);
            let notificationObj: OSNotification = {
                headings: {en: "New Friend Request"},
                isAppInFocus: true,
                shown: true,
                data: {type: "friend"},
                payload: {
                  //id of the template for a new request
                  notificationID: "fe62f88f-dec5-48d0-97c3-ebbd2172e010",
                  title: "New Friend Request",
                  body: "You have a new friend request.",
                  sound: "",
                  actionButtons: [],
                  rawPayload: ""
                },
                displayType: 1,
                contents: {en: this.authProvider.user.username+" has sent you a friend request."},
                include_player_ids: destinationIds
              };
            this.oneSignal.postNotification(notificationObj)
                          .then((someData) => {
                            console.log(someData);
                            let notification = {
                              type: "friend",
                              description: this.authProvider.user.username+" has sent you a friend request.",
                              sender: this.authProvider.user._id,
                              receiver: recipients[0]._id,
                              obj: recipients[0]._id
                            };
                            let edit = {
                              type: "notification",
                              notification: notification,
                              id: recipients[0]._id,
                            };
                            console.log("EDIT OBJ");
                            console.log(edit);
                            this.authProvider.update(edit).subscribe((ret)=> {
                                if(ret.success){
                                  //do nothing
                                }
                                else {
                                  console.log(ret.msg);
                                }
                            });

                          })
                          .catch((someErr) => {
                            console.log(someErr);
                          })

          });
        }
        else {
          console.log("Ultimate Failure/Vegeta");
        }
    })
    console.log(friendObj);
  }
}
