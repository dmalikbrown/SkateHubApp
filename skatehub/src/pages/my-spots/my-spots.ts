import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from './../../providers/spots/spots';


/**
 * Generated class for the MySpotsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-spots',
  templateUrl: 'my-spots.html',
})
export class MySpotsPage {
  // myspots
  spots: any = [];
  id: any;
  user: any;
  spotsArr: any = [];
  savedSpotsArr: any = [];
  categories: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, public spotsProvider: SpotsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MySpotsPage');
  }
  ionViewDidLeave(){
    //clear so it doesn't duplicate
    this.spotsArr = [];
    this.savedSpotsArr = [];
  }
  ionViewDidEnter(){
    if(this.authProvider.user){
      this.user = this.authProvider.user;
    }
    else{
      this.user = this.navParams.data;
	}
    /*
	 * Gets the user by the user id. Gets all the spots
	 * then we check to see if the user id is the same
	 * as the spot user id and add it to the spotsArr.
	 * Can be used to get all information from spot.
	 *
	 */
    this.authProvider.getUser(this.user._id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
        this.user = data.user;
        //this.spots = this.user.spots;
        this.spotsProvider.getAllSpots().subscribe((data) => {
          if (data.success) {
            for (const spot of data.spots) {
              if (spot.userId == this.authProvider.user._id) {
                this.spotsArr.push(spot);
                console.log("++++++++++++", spot.userId, this.authProvider.user._id);
              }
            }
            if(this.user.savedSpots){
              let len = this.user.savedSpots.length;
              for(let i = 0; i<len; i++){
                let index = data.spots.findIndex((spotVal) => spotVal._id == this.user.savedSpots[i].id);
                if(index < 0) continue;
                this.savedSpotsArr.push(data.spots[index]);
              }
              console.log(this.savedSpotsArr);
            }

          }
        });
	  } else {
         console.log("Error: mySpotsPage, failed UserId");
      }
    });
  }

  loadPostedSpots(){
    console.log("Posted Spots");
  }
  loadSavedSpots(){
    console.log("Saved Spots");
  }

}
