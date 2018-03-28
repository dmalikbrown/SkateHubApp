import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';

import { OtherUserSpotsPage } from '../../pages/other-user-spots/other-user-spots';
import { FriendsPage } from './../../pages/friends/friends'
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, public spotsProvider: SpotsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailedUserPage');
  }



  /*
  * Checks to see if the navParams are given. Doesn't check anything.
  * TODO implement some checks
  */
  ionViewDidEnter(){
    this.authProvider.loadUser();
    this.me = this.authProvider.user;
    console.log(this.me);

    if(this.navParams){
      console.log("if statement, ionViewDidEnter", this.navParams);
	  this.userId = this.navParams.data.id;
	  console.log("stringify", JSON.stringify(this.userId));
    }
	else{
	  console.log("Error: ionViewDidEnter, navParams");
      this.userId = this.navParams;
	}
    console.log("outside of if statement, ionViewDidEnter");
    this.getUser(this.navParams.data.id);
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
         this.checkFriends();
        //this.spots = this.user.spots;
        this.spotsProvider.getAllSpots().subscribe((data) => {
          if (data.success) {
            for (const spot of data.spots) {
              if (spot.userId == this.navParams.data.id) {
                this.spotsArr.push(spot);
                console.log("++++++++++++", spot.userId, this.navParams.data.id);
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
      console.log("here bitch");
      let len = this.me.friends.length;
      for(let i = 0; i<len; i++){
        //if statement to check if you've sent a friend request to this user
        if(this.me.friends[i].id == this.user._id && !this.me.friends[i].request){
          console.log("also here bitch");
          this.hasRequested = true;
        }
        else {
          this.hasRequested = false;
        }
      }
    }

  }

  spotsPage(){
    this.navCtrl.push(OtherUserSpotsPage, {spots: this.spotsArr, user: this.user});
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
      console.log("Success");
        }
        else {
      console.log("Ultimate Failure/Vegeta");
        }
    })
    console.log(friendObj);
  }
}
