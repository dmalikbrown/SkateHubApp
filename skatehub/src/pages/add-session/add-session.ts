import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { SpotsProvider } from '../../providers/spots/spots';
import { AuthProvider } from '../../providers/auth/auth';
import { InviteProvider } from '../../providers/invite/invite';
/**
 * Generated class for the AddSessionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-session',
  templateUrl: 'add-session.html',
})
export class AddSessionPage {

  user: any;
  spotIds: any = [];
  savedSpotIds: any = [];
  spots: any = [];
  friends: any = [];
  hasFriends: boolean = false;
  reqMeet: boolean = true;
  choosenSpot: any;
  choosenUsers: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public spotsProvider: SpotsProvider,
              public authProvider: AuthProvider, public inviteProvider: InviteProvider,
              public oneSignal: OneSignal) {
  }
  /**
* LifeCycle called by ionic, loads necessary information
* @method ionViewDidLoad
* @param none
* @return none
*/

  ionViewDidLoad() {
    this.user = this.navParams.get('user');
    // console.log(this.user);
    if(this.navParams.get('spots')){
      this.spotIds = this.navParams.get('spots');
    }
    if(this.navParams.get('savedSpots')){
      this.savedSpotIds = this.navParams.get('savedSpots');
    }
    this.spotIds = this.spotIds.concat(this.savedSpotIds);
    // this.spotIds = this.navParams.get('spots').concat(this.navParams.get('savedSpots'));
    this.loadSpots();
    this.loadFriends();
  }
  /**
* Loads the spot information
* @method loadSpots
* @param none
* @return none
*/
  loadSpots(){
    let len = this.spotIds.length;
    for(let i = 0; i < len; i++){
      this.spotsProvider.getSpotById(this.spotIds[i].id).subscribe((data) => {
        if(data.success){
          this.spots.push(data.spot);
          console.log(this.spots);
        }
        else {
          //ERROR
          console.log(data.msg);
        }
      });
    }
  }
  /**
* Loads the friend information
* @method loadFriends
* @param none
* @return none
*/
  loadFriends(){
    if(this.user.friends){
      let acceptedFriends = this.user.friends.filter(friend => friend.request == true);
      let len = acceptedFriends.length;
      for(let i = 0; i<len; i++){
        let idVal = "";
        if(acceptedFriends[i].id == this.user._id){
          idVal = acceptedFriends[i].sender;
        }
        else {
          idVal = acceptedFriends[i].id;
        }
        this.getUsersFromArr(idVal);
      }
    }

  }
  /**
* Retrieves users by id from the server
* @method getUsersFromArr
* @param id: string, MongoDB id assigned to user
* @return none
*/
  getUsersFromArr(id){
    if(!id) return;
    this.authProvider.getUser(id).subscribe((data)=>{
      if(data.success){
        this.hasFriends = true;
        this.friends.push(data.user);
      }
      else {
        console.log("error");
      }
    });
  }
  /**
* Pushes choosen users to an array
* @method pushUser
* @param {object} user, the user object that is chosen
* @return none
*/
  pushUser(user){
    let idObj = {
      id: user._id
    };
    user.checked = true;
    this.choosenUsers.push(idObj);
    if(this.choosenSpot){
      this.reqMeet = true;
    }
  }
  /**
* Toggle reqMeet variable
* @method toggleReq
* @param none
* @return none
*/
  toggleReq(){
    if(this.choosenSpot && this.choosenUsers.length > 0) {
      this.reqMeet = true;
    }
    else {
      this.reqMeet = false;
    }
  }
  /**
* Removes user from choosenUsers array
* @method removeUser
* @param {object} user - represents the user that's being removed
* @param {int} index - represents the index in the choosenArray for user
* @return none
*/
  removeUser(user, index){
    user.checked = false;
    this.choosenUsers.splice(index,1);
    if(this.choosenUsers.length == 0){
      this.reqMeet = false;
    }
  }
  /**
* Creates a session and sends invites to the choosenUsers array.
* @method startSession
* @param none
* @return none
*/
  startSession(){
    let someBool = false;
    let inviteObj = {
      sender: this.user._id,
      spot: this.choosenSpot._id,
      users: this.choosenUsers
    };
    this.authProvider.loadToken();
    this.inviteProvider.sendInvite(inviteObj, this.authProvider.token).subscribe((data) => {
      if(data.success){

        let len = this.choosenUsers.length;
        for(let i = 0; i<len; i++){
          let inviteObj = {
            userId: data.invite.users[i].id,
            inviteId: data.invite._id
          };
          this.authProvider.addInvites(inviteObj).subscribe((moreData)=>{
            if(moreData.success){
              //TODO send notifications
              this.authProvider.getOneSignalDevices().subscribe((results) => {

                let len = results.total_count;
                let destinationId = "";
                for(let j = 0; j<len; j++){
                  if(results.players[j].tags.user_id == data.invite.users[i].id){
                    // let destinationId = results.players[i].tags.player_id;
                    // console.log("DID THIS CODE EVEN RUN???");
                    destinationId = results.players[j].id;
                    // console.log(destinationId);
                    break;
                  }
                }
                //TODO send notification
                console.log(destinationId);
                let notificationObj: OSNotification = {
                    headings: {en: "Session Invite"},
                    isAppInFocus: true,
                    shown: true,
                    data: {type: "invite"},
                    payload: {
                      //id of the template for a new message
                      notificationID: "e752e407-24fa-4b24-a8ae-af1eec1e385e",
                      title: "Session Invite",
                      body: "Invite details",
                      sound: "",
                      actionButtons: [],
                      rawPayload: ""
                    },
                    buttons: [{"id": "accept", "text": "Going"}, {"id": "decline", "text": "Decline"}],
                    displayType: 1,
                    contents: {en: this.user.username+" has invited you to a skate sesh at: "+this.choosenSpot.name},
                    include_player_ids: [destinationId]
                  };
                  let notification = {
                    type: "invite",
                    description: this.user.username+" has invited you to a skate sesh at: "+this.choosenSpot.name,
                    sender: this.user._id,
                    receiver: data.invite.users[i].id,
                    obj: data.invite._id
                  };
                  let edit = {
                    type: "notification",
                    notification: notification,
                    id: data.invite.users[i].id,
                  };
                  this.authProvider.update(edit).subscribe((ret)=> {
                      if(ret.success){
                        //send notification
                        this.oneSignal.postNotification(notificationObj)
                                      .then((someData) => {
                                        console.log(someData);

                                      })
                                      .catch((someErr) => {
                                        console.log(someErr);
                                      })
                      }
                      else {
                        console.log(ret.msg);
                      }
                  });


              });

            }
            else {
              console.log(moreData.msg);
            }
          });
        }
        this.viewCtrl.dismiss({success: true, invite: data.invite});
      }
      else {
        //Error
      }
    });
  }

  closeModal(){
    this.viewCtrl.dismiss({success: false, error: false});
  }

}
