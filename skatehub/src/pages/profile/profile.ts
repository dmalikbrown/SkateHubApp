import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController,
  ToastController} from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { InvitesPage } from './../../pages/invites/invites';
import { FriendsPage } from './../../pages/friends/friends';
import { MySpotsPage } from './../../pages/my-spots/my-spots';
import { SavedSpotsPage } from './../../pages/saved-spots/saved-spots';
import { SettingsPage } from './../../pages/settings/settings';
import { LoginPage } from './../../pages/login/login';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userId: any;
  user: any;
  defaultAvatar: any = "assets/imgs/profileGeneric.jpg";
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider, public app: App,
              public alertCtrl: AlertController, public toastCtrl: ToastController) {
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
      this.userId = this.authProvider.user.id;
    }
    else{
      this.userId = this.navParams.data.id;
    }

    this.getUser(this.userId);
  }
/*
  profilePage(){
    console.log("Profile");
    //Launches the profile page.
    //this.navCtrl.push("myProfile");
  }
  */
  getUser(id){
    this.authProvider.getUser(id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
        this.user = data.user;
        console.log(this.user);
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
      }
    });
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
      closeButtonText: closeButtonText
    });
    toast.present();
  }
  mySpotsPage(){
    console.log("My Spots");
    this.navCtrl.push(MySpotsPage, {spots: this.user.spots});
  }
  friendsPage(){
    console.log("Friends");
    this.navCtrl.push(FriendsPage);
  }
  invitesPage(){
    console.log("Invites");
    this.navCtrl.push(InvitesPage);
  }
  savedSpotsPage(){
    console.log("Saved Spots");
    this.navCtrl.push(SavedSpotsPage);
  }
  settingsPage(){
    console.log("Settings");
    this.navCtrl.push(SettingsPage);
  }
  logout(){
    this.authProvider.logout();
    //this.events.publish('logout');
    this.app.getRootNavs()[0].push(LoginPage);
  }

  changeStance(){
    console.log("Stance Changed");
    if(this.user.stance == null)
    {
      this.user.stance = "Goofy";
      // let obj = {
      //   stance: "Goofy"
      // }
      // this.authProvider.registerUser(obj).subscribe((data)=>{
      //   if(data.success){ //valid register set root to TabsPage with params
      //     console.log("Saving data" + data.token);
      //     this.authProvider.storeUserData(data.token, data.user.Stance);
      //   }
      //   else{
      //     let alert = this.alertCtrl.create({
      //       title: 'Error',
      //       subTitle: data.msg,
      //       buttons: ["Dismiss"]
      //     });
      //     alert.present();
      //   }
      // });
      return;
   }
    else if(this.user.stance == "Goofy")
    {
      this.user.stance = "Regular";

      return;
    }
    else if(this.user.stance == "Regular")
    {
      this.user.stance = "Goofy";

      return;
    }
    //this.user.stance = null;
    //else{return;}
    console.log(this.user.stance);
  }

}
