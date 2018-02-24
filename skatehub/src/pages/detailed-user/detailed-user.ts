import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';


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

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailedUserPage');
  }



  /*
  * Checks to see if the navParams are given. Doesn't check anything. 
  * TODO implement some checks
  */ 
  ionViewDidEnter(){
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
  * Can be used to get more info from the user.
  */
  getUser(id){
    this.authProvider.getUser(id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
        this.user = data.user;
        console.log(this.user);
	  } else {
        console.log("Error: UserDetailedPage, failed to get UserId"); 
      }
    });
  } 
}
