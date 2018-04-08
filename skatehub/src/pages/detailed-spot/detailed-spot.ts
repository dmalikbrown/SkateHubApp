import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { AuthProvider } from './../../providers/auth/auth';


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
  // comment and rate spot
  title: any;
  description: any;
  rating: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation,public authProvider: AuthProvider,
  public launchNavigator: LaunchNavigator, public actionSheet: ActionSheetController, public alertCtrl: AlertController) {
  }

  /*
  When the view is loaded, get the spot from the navParams. Whatever page pushed
  the detailed spot page must send a spot in the parameters. We should check if
  the "this.navParams.get('spot')" actually equals null or undefined.

  After getting the spot, get the id which is also sent from the page that pushed
  the detailed spot page. Using the userId on the spot, compare it with the
  navparams id value. If they equal, then the user is viewing their own post.
  */
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
  }

  /*
  Open an action handler that contains 3 buttons: 'Save Spot', and
  'Cancel'.
  @parameters    none
  @return        nothing
  */
  openAction(){
    //create the action sheet with necessary object/values
    let actionSheet = this.actionSheet.create({
     buttons: [
       {
         text: 'Save Spot',
         handler: () => {
           console.log('Saved spot clicked');
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
   actionSheet.present(); //display the action sheet after creating
}

/*
Open a navigation action handler that contains the different navigation apps
on the user's device.
@parameters    none
@return        nothing
*/
saveSpt(type: string, spot){
   let editObj = {
     id: this.authProvider.user._id,
     type: type,
     savedSpots: {id: spot._id},
   };
  console.log('editObj', editObj.savedSpots, spot._id);

  this.authProvider.update(editObj).subscribe((data) => {
  if(data.success){
      console.log("Successfully saved spot");
    } else {
      console.log("Error when saving spot");
    }
  });

}
  saveSpot(spot){
    this.saveSpt('savedSpots', spot);
  }
  openNavigation(){
    //grab the user's current location
    this.geolocation.getCurrentPosition().then((resp) => {
    // resp.coords.latitude
    // resp.coords.longitude
      this.start = resp.coords.latitude+","+resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    this.destination = this.spot.location;
    let options: LaunchNavigatorOptions = { //set navigator options
      start: this.start
    };
    //open the navigator action handler
    this.launchNavigator.navigate(this.destination, options)
        .then(
            success => console.log('Launched navigator'),
            error => console.log('Error launching navigator: ' + error)
    );
  }
  /*
   * This is opens up a prompt to let the user
   * report the spot.
   */
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Report Spot',
      message: "What's wrong with the spot?",
      inputs: [
        {
          name: 'Report Spot',
          placeholder: 'Report'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
}
