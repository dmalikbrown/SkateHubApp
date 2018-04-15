import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetailedSpotPage } from '../../pages/detailed-spot/detailed-spot';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from './../../providers/spots/spots';
/**
 * Generated class for the OtherUserSpotsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-other-user-spots',
  templateUrl: 'other-user-spots.html',
})
export class OtherUserSpotsPage {

  spots: any = [];
  id: any;
  user: any;
  spotsArr: any = [];
  savedSpotsArr: any = [];
  categories: any = "postedSpots";

  constructor(public navCtrl: NavController, public navParams: NavParams,
        public authProvider: AuthProvider, public spotsProvider: SpotsProvider) {
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
    this.user = this.navParams.get('user');
    this.authProvider.getUser(this.user._id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
        this.user = data.user;
        //this.spots = this.user.spots;
        this.spotsProvider.getAllSpots().subscribe((data) => {
          if (data.success) {
            for (const spot of data.spots) {
              if (spot.userId == this.user._id) {
                this.spotsArr.push(spot);
              }
      }
            if(this.user.savedSpots){
              let len = this.user.savedSpots.length;
              for(let i = 0; i<len; i++){
                let index = data.spots.findIndex((spotVal) => spotVal._id == this.user.savedSpots[i].id);
                if(index < 0) continue;
                this.savedSpotsArr.push(data.spots[index]);
              }
              // console.log(this.savedSpotsArr);
            }

          }
        });
    } else {
         console.log("Error: mySpotsPage, failed UserId");
      }
    });
  }

  openDetailedSpot(spot){
      this.navCtrl.push(DetailedSpotPage, {spot: spot, id: this.user._id});
      console.log('Go to Post clicked');
  }



}
