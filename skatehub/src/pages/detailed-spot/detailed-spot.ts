import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

/**
 * Generated class for the DetailedSpotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailed-spot',
  templateUrl: 'detailed-spot.html',
})
export class DetailedSpotPage {
  spot: any;
  isUser: boolean;
  start: any = "";
  destination: any = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation,
  public launchNavigator: LaunchNavigator, public actionSheet: ActionSheetController) {
  }

  ionViewDidLoad() {
    this.spot = this.navParams.get('spot');
    if (this.spot.userId == this.navParams.get('id'))
    {
      this.isUser = true;
    }
    else
    {
        this.isUser = false;
    }
    console.log(this.spot);
    console.log(this.isUser);
    console.log('ionViewDidLoad DetailedSpotPage');
  }

  openAction(){
    let actionSheet = this.actionSheet.create({
     buttons: [
       {
         text: 'Save Spot',
         handler: () => {
           console.log('Saved spot clicked');
         }
       },
       {
         text: 'Report Spot',
         handler: () => {
           console.log('Report Spot clicked');
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });
   actionSheet.present();
}

  openNavigation(){
    this.geolocation.getCurrentPosition().then((resp) => {
    // resp.coords.latitude
    // resp.coords.longitude
      this.start = resp.coords.latitude+","+resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    this.destination = this.spot.location;
    let options: LaunchNavigatorOptions = {
      start: this.start
    };
    this.launchNavigator.navigate(this.destination, options)
        .then(
            success => console.log('Launched navigator'),
            error => console.log('Error launching navigator: ' + error)
    );
  }

}
