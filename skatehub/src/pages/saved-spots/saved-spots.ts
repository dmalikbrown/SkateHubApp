import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from './../../providers/spots/spots';

/**
 * Generated class for the SavedSpotsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-saved-spots',
  templateUrl: 'saved-spots.html',
})
export class SavedSpotsPage {
  // savedSpots 		
  spots: any = [];
  id: any; 
  user: any; 
  saveSpotsArr: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public authProvider: AuthProvider, public spotsProvider: SpotsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedSpotsPage');
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
	 * as the spot user id and add it to the saveSpotsArr.
	 * Can be used to get all information from spot.
	 *
	 */
    this.authProvider.getUser(this.user.id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
        this.user = data.user; 
        //this.spots = this.user.spots; 
        this.spotsProvider.getAllSpots().subscribe((data) => {
          if (data.success) { 
            for (const spot of data.spots) { 
              if (spot.userId == this.authProvider.user.id) {
                this.saveSpotsArr.push(spot);   
                console.log("++++++++++++", spot.userId, this.authProvider.user.id);
              }
            }
          }
         });
      } else {
          console.log("Error: savedSpotsPage, failed UserId"); 
      }
    });
  }
}
