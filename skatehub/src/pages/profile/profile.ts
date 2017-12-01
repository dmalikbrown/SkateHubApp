import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider) {
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
/*
  profilePage(){
    console.log("Profile");
    //Launches the profile page.
    //this.navCtrl.push("myProfile");
  }
  */
  mySpotsPage(){
    console.log("My Spots");
    this.navCtrl.push("MySpotsPage");
  }
  friendsPage(){
    console.log("Friends");
    this.navCtrl.push("FriendsPage");
  }
  invitesPage(){
    console.log("Invites");
    this.navCtrl.push("InvitesPage");
  }
  savedSpotsPage(){
    console.log("Saved Spots");
    this.navCtrl.push("SavedSpotsPage");
  }
  settingsPage(){
    console.log("Settings");
    this.navCtrl.push("SettingsPage");
  }
  /*
  logOutPage(){
    console.log("Log Out");
  }
  */
}
