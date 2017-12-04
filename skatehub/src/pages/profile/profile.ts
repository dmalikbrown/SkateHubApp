import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider, public app: App) {
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
      }
      else {
        //TODO Error alert
      }
    });
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
  /*
  logOutPage(){
    console.log("Log Out");
  }
  */
}
