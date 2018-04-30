import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController,
  ToastController, ActionSheetController, Platform, ModalController} from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from './../../providers/spots/spots';
import { InviteProvider } from './../../providers/invite/invite';
import { AddSessionPage } from './../../pages/add-session/add-session';
import { FriendsPage } from './../../pages/friends/friends';
import { SettingsPage } from './../../pages/settings/settings';
import { DetailedSpotPage } from './../../pages/detailed-spot/detailed-spot';
import { AddFriendPage } from '../../pages/add-friend/add-friend';
import { DetailedUserPage} from '../../pages/detailed-user/detailed-user';
import { SeshesPage } from '../../pages/seshes/seshes';
import { LoginPage } from './../../pages/login/login';
// import * as moment from 'moment';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 // declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userId: any;
  user: any;
  inviteIds: any = [];
  spots: any = [];
  savedSpots: any = [];
  sortText: any = "YOUR SPOTS";
  requested: any = [];
  accepted: any = [];
  requests: any = [];
  friends: any = [];
  emptyRequests: boolean = true;
  emptyInvites: boolean = true;
  sort: boolean = true;
  defaultAvatar: any = "assets/imgs/profileGeneric.jpg";
  // imagePath: any;
  // imageNewPath: any;
  // imageChosen: any = 0;
  stance: any;
  categories: any = "posts";
  // devEp: any = "http://localhost:3000";
  // prodEp: any = "https://skatehub.herokuapp.com";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider, public app: App,
              public alertCtrl: AlertController, public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController,
              public spotsProvider: SpotsProvider, public modalCtrl: ModalController,
              public inviteProvider: InviteProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewCanEnter(){
    this.authProvider.isValidToken().then((res) => {
         console.log("Already authorized");
        return true;
     }, (err) => {
         console.log("Not already authorized");
         return false;
     });
  }
  ionViewDidEnter(){
    if(this.authProvider.user){
      this.userId = this.authProvider.user._id;
    }
    else{
      this.userId = this.navParams.data.id;
    }

    this.getUser(this.userId);
  }

  ionViewWillLeave(){
    this.friends = [];
    this.requests = [];
    this.accepted = [];
    this.requested = [];
  }
  openDetailedSpot(spot){
      this.navCtrl.push(DetailedSpotPage, {spot: spot, id: this.user._id});
      console.log('Go to Post clicked');
  }
  openSortAS(){
    let actionSheet = this.actionSheetCtrl.create({
       title: 'SORT POSTS BY',
       buttons: [
         {
           text: 'My Spots',
           handler: () => {
             this.sortText = "YOUR SPOTS";
             this.sort = true;
             // this.actionHandler(1);
           }
         },
         {
           text: 'Saved Spots',
           handler: () => {
             this.sortText = "YOUR SAVED SPOTS";
             this.sort = false;
             // this.actionHandler(2);
           }
         },
         {
           text: 'Cancel',
           role: 'cancel'
         }
       ]
     });

     actionSheet.present();
  }

  getUser(id){
    console.log(id);
    this.authProvider.getUser(id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
        this.user = data.user;
        this.authProvider.updateUser(this.user);
        this.loadInfo();
        this.inviteIds = this.user.invites;
        this.loadInviteInfo();
        this.filterFriends();
        // console.log(this.user);
        // this.imagePath = this.user.avatar;
        if(this.checkAvatar() && this.checkStance()){
          let msg = "Update your profile picture and skate stance to enhance your profile!";
          let pos = "top";
          let cssClass = "warning";
          let showCloseButton = true;
          let closeButtonText = "Ok";
          this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
        }
        else if(this.checkAvatar()){
          let msg = "Update your profile picture to enhance your profile!";
          let pos = "top";
          let cssClass = "warning";
          let showCloseButton = true;
          let closeButtonText = "Ok";
          this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
        }
        else if(this.checkStance()){
          let msg = "Update your skate stance to enhance your profile!";
          let pos = "top";
          let cssClass = "warning";
          let showCloseButton = true;
          let closeButtonText = "Ok";
          this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
        }
      }
      else {
        //TODO Error alert
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: data.msg,
          buttons: ["Dismiss"]
        });
        alert.present();
        return false;
      }
    });
  }
  getUsersFromArr(id, type){
    if(!id) return;
    this.authProvider.getUser(id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
        if(type == "request"){
          this.requests.push(data.user);
        }
        else {
          this.friends.push(data.user);
        }
      }
      else {
        console.log("error bitchhhh");
        //TODO Error alert
        // let alert = this.alertCtrl.create({
        //   title: 'Error',
        //   subTitle: data.msg,
        //   buttons: ["Dismiss"]
        // });
        // alert.present();
        // return false;
      }
    });
  }
  loadInfo(){
    this.spotsProvider.getSpotsByUserId(this.user._id).subscribe((data) => {
      if(data.success){
        this.spots = data.spots;
        console.log(this.spots);
      }
      else {
        console.log(data.msg);
      }
    });
    this.spotsProvider.getSavedSpotsByArr(this.user._id).subscribe((data) => {
      if(data.success) {
        this.savedSpots = data.spots;
        console.log(this.spots);
      }
      else {
        console.log(data.msg);
      }
    });
  }
  loadInviteInfo(){
    let len = this.inviteIds.length;
    for(let i = 0; i<len; i++){
      this.inviteProvider.getInvite(this.inviteIds[i].id, this.authProvider.token)
        .then((someObs)=>{
            someObs.subscribe((data) => {

              if(data.success){
                let invite = data.invite;
                if(!invite) return;
                // console.log(invite);
                if(this.checkDecline(invite)) return;
                this.authProvider.getUser(data.invite.sender).subscribe((userData)=>{
                  if(userData.success){
                    invite.sender = userData.user;
                    this.spotsProvider.getSpotById(data.invite.spot).subscribe((spotData)=>{
                      if(spotData.success){
                        invite.spot = spotData.spot;
                        // console.log(userData);
                        if(this.checkAccepted(invite) && invite.active
                          || this.authProvider.user._id == userData.user._id){
                          this.emptyInvites = false;
                          this.accepted.push(invite);
                        }
                        else {
                          if(invite.active){
                            this.emptyRequests = false;

                            this.requested.push(invite);
                          }
                        }
                      }
                      else {
                        //TODO error
                      }
                    });
                  }
                  else {
                    //TODO error
                  }
                });
              }
              else {
                console.log(data.msg);
              }
            });
      });
    }
  }
  filterFriends(){
    if(this.user.friends){
      // let len = this.user.friends;
      let dummyReq = [];
      let dummyFriends = [];
      dummyReq = this.user.friends.filter((friend) => friend.request == false && friend.sender != this.user._id);
      dummyFriends = this.user.friends.filter((friend) => friend.request == true);
      // console.log(dummyReq);
      let reqL = dummyReq.length;
      let fL = dummyFriends.length;

      for(let i = 0; i<reqL; i++){
        this.getUsersFromArr(dummyReq[i].sender, 'request');
      }
      for(let i = 0; i<fL; i++){
        let idVal = "";
        if(dummyFriends[i].id == this.user._id){
          idVal = dummyFriends[i].sender;
        }
        else {
          idVal = dummyFriends[i].id;
        }
        this.getUsersFromArr(idVal, 'friends');
      }

    }
  }
  checkDecline(invite){
    let index = invite.declined.findIndex(user => user.id == this.user._id);
    if(index > -1){
      return true;
    }
    return false;
  }
  checkAccepted(invite){
    let index = invite.accepted.findIndex(user => user.id == this.user._id);
    if(index > -1){
      return true;
    }
    return false;
  }
  checkAvatar(){
    if(this.user.avatar == this.defaultAvatar){
      return true;
    }
    return false;
  }

  checkStance(){
    if(this.user.stance == '' || !this.user.stance){
      return true;
    }
    return false;
  }
  toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText){
    let toast = this.toastCtrl.create({
      message: msg,
      position: pos,
      cssClass: cssClass,
      showCloseButton: showCloseButton,
      closeButtonText: closeButtonText,
      dismissOnPageChange: true
    });
    //Fixes the bug issue #62 .. gotta call dismiss function at some point
    toast.present().then(() => {
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    });
  }
  avatarClick(friend){
   this.navCtrl.push(DetailedUserPage, {username: friend.username, id: friend._id});
  }

  acceptFriendRequest(request){
    let obj = {
      id: this.user._id,
      friend: request,
      type: "accept-request"
    };
    this.authProvider.update(obj).subscribe((data) => {
      if(data.success){
        console.log(data.msg);
        this.requests = [];
        this.friends = [];
        this.getUser(this.user._id);
      }
      else {
        console.log("yO BITCH");
      }
    });
  }

  openAddFriendsPage(){
    this.navCtrl.push(AddFriendPage);
  }
  pushSeshesPage(sesh, hasJoined){
    this.navCtrl.push(SeshesPage, {user: this.user, session: sesh, hasJoined: hasJoined});
  }
  // mySpotsPage(){
  //   console.log("My Spots");
  //   this.navCtrl.push(MySpotsPage, {spots: this.user.spots});
  // }
  friendsPage(){
    console.log("Friends");
    this.navCtrl.push(FriendsPage, {user: this.user});
  }
  // invitesPage(){
  //   console.log("Invites");
  //   this.navCtrl.push(InvitesPage,
  //     {
  //       user: this.user,
  //       invites: this.user.invites,
  //       spots: this.user.spots,
  //       savedSpots: this.user.savedSpots
  //     });
  // }
  // savedSpotsPage(){
  //   console.log("Saved Spots");
  //   this.navCtrl.push(SavedSpotsPage, {spots: this.user.savedSpots});
  // }
  acceptInvite(invite, index){
    let obj = {
      userId: {
        id: this.user._id
      },
      inviteId: invite._id
    };
    this.inviteProvider.acceptInvite(obj, this.authProvider.token).subscribe((data)=>{
      if(data.success){
        this.requested.splice(index, 1);
        if(this.requested.length == 0 ){
          this.emptyRequests == true;
        }
        this.loadInviteInfo();
      }
      else {
        console.log(data.msg);
      }
    });
  }
  declineInvite(invite, index){
    let obj = {
      userId: {
        id: this.user._id
      },
      inviteId: invite._id
    };
    this.inviteProvider.declineInvite(obj, this.authProvider.token).subscribe((data)=>{
      if(data.success){
        this.requested.splice(index, 1);
        if(this.requested.length == 0 ){
          this.emptyRequests == true;
        }
        this.loadInviteInfo();
      }
      else {
        console.log(data.msg);
      }
    });
  }
  openSessionModal(){
    if((this.user.spots.length == 0 && this.user.savedSpots.length == 0) ||
    this.user.friends.length == 0)
    {
      //TODO alert or something
      let alert = this.alertCtrl.create({
        title: 'No spots',
        subTitle: "Create or save a spot to create a session",
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }

    let modal = this.modalCtrl.create(AddSessionPage, {
      user: this.user,
      spots: this.user.spots,
      savedSpots: this.user.savedSpots
    });
    modal.onDidDismiss((data) => {
      if(data.success){
        let idObj = {
          id: data.invite._id
        }
        this.inviteIds.push(idObj);
        this.accepted = [];
        this.requested = [];
        this.loadInviteInfo();
      }
      else if(data.error) {
        //TODO error
      }
      else {
        //do nothing
      }
    });
    modal.present();
  }
  settingsPage(){
    console.log("Settings");
    // this.navCtrl.push(SettingsPage, {id: this.userId});
    let modal = this.modalCtrl.create(SettingsPage, {id: this.userId});
    modal.onDidDismiss(() => {
      this.getUser(this.user._id);
    });
    modal.present();
  }
  logout(){
    this.authProvider.logout();
    //this.events.publish('logout');
    this.app.getRootNavs()[0].push(LoginPage);
  }

  /*
  *Checks to see if the current stance has an appropriate value
  *allows the user to simply tap the text to change it to ther preferred value
  *working on getting it to talk back to the server*
  */
  changeStance(){
    console.log("Stance Changed");

    if(this.user.stance == null)
    {

      this.user.stance = "Goofy";
      console.log("Goofy stance has been chosen.");
    }
    else if(this.user.stance == "Goofy")
    {
      this.user.stance = "Regular";
      console.log("Regular stance has been chosen.");
			// return;
    }
    else if(this.user.stance == "Regular")
    {
      this.user.stance = "Goofy";
      console.log("Last elif, Goofy stance has been chosen.");
      //  return;
    }
    let edits = {
            id: this.userId,
            type: "stance",
            stance: this.user.stance
    };

    this.authProvider.update(edits).subscribe((data)=>{
      if(data.success){
        console.log(this.user.stance, "data success");
        let msg = "Successfully changed stance!";
        let pos = "top";
        let cssClass = "success";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
      }
      else {
        console.log("data was not a success.");
        let msg = "Failed at changing stance!";
        let pos = "top";
        let cssClass = "warning";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
      }
    });
  }

  setBackground(){
    // console.log(this.headerImagePath);
    if(this.user.headerImage != "" && this.user.headerImage){
      return {
           "background-color": "",
           "background-image": "url("+this.user.headerImage+")",
           "background-repeat": "no-repeat",
           "background-size": "100% 8em",
           "position": "absolute",
           "width": "100%",
           "height": "8em"
      }
    }
    else {
      // console.log("here");
      return {
           "background-color": '#9bbff2',
           "position": "absolute",
           "width": "100%",
           "height": "8em"
      }
    }
  }

}
