import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, AlertController,
  ActionSheetController, PopoverController, Events} from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from './../../providers/spots/spots';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { DetailedSpotPage } from '../../pages/detailed-spot/detailed-spot';
import { InboxPage } from '../../pages/inbox/inbox';
import { FilterPage } from '../../pages/filter/filter';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;


  user: any;
  state: any;
  spots: any = [];
  spotsVarHolder: any = [];
  noSpots: boolean;
  start: any = "";
  destination: any = "";

  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
            public navParams: NavParams, public spotsProvider: SpotsProvider,
            public alertCtrl: AlertController, public launchNavigator: LaunchNavigator,
            public geolocation: Geolocation, public actionSheet: ActionSheetController,
            public popoverCtrl: PopoverController, public event: Events) {

              this.event.subscribe('filter:event', (data) => {
                console.log(data);
                //TODO make a function that filters the spots based on type
              });
  }

  openInbox(){
      this.navCtrl.push(InboxPage);
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(FilterPage);
    popover.present({
      ev: myEvent
    });
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
  Calls 'grabPosts' function that grabs all skate spots posted. Initializes the user
  object.
  @parameters    none
  @return        nothing
  */
  ionViewDidEnter(){
    this.grabPosts();
    if(this.authProvider.user){
      this.user = this.authProvider.user;
    }
    else{
      this.user = this.navParams.data;
    }

  }

  /*
  Makes server call using the spotsProvider to grab all posts updating the array.
  @parameters    none
  @return        nothing
  */
  grabPosts(){
    this.spotsProvider.getAllSpots().subscribe((data) =>{
      if(data.success){
        this.spots = data.spots;
        this.spotsVarHolder = this.spots;
        if(this.spots.length == 0){
          this.noSpots = true;
        }
        else {
          this.noSpots = false;
        }
      }
      else {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: data.msg,
          buttons: ["Dismiss"]
        });
        alert.present();
      }
    });

  }
  /*
  Filters the spots by their state. spotsVarHolder will always contain all posts
  so that variable can be used to filter.
  @parameters    none
  @return        nothing
  */
  filterByState(){
    if(this.state == 'all'){
      this.spots = this.spotsVarHolder;
      return;
    }
    // use array filter function calling parseStateFromSpot function.
    this.spots = this.spotsVarHolder.filter(x => this.parseStateFromSpot(x) == this.state);
    if(this.spots.length == 0){
      this.noSpots = true;
    }
    else {
      this.noSpots = false;
    }
  }
  /*
  Parse the state from a spot
  @parameters    spot     the spot that needs to be parsed
  @return        state    string containing the state (abbr).
  */
  parseStateFromSpot(spot){
    let location = spot.location;
    let state = location.substring(location.lastIndexOf(',')+1).replace(/ /g, ""); //replace white space
    return state;
  }
  /*
  Open a navigation action handler that contains the different navigation apps
  on the user's device.
  @parameters    none
  @return        nothing
  */
  openNavigation(spot){
    this.geolocation.getCurrentPosition().then((resp) => {
    // resp.coords.latitude
    // resp.coords.longitude
      this.start = resp.coords.latitude+","+resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    this.destination = spot.location;
    let options: LaunchNavigatorOptions = {
      start: this.start
    };
    this.launchNavigator.navigate(this.destination, options)
        .then(
            success => console.log('Launched navigator'),
            error => console.log('Error launching navigator: ' + error)
    );
  }
  /*
  Open an action handler that contains 3 buttons: 'View Spot', 'Save Spot', and
  'Cancel'.
  @parameters    spot    the current spot in the array that is being tapped.
  @return        nothing
  */
  openDetailedAction(spot){
    let actionSheet = this.actionSheet.create({
     buttons: [
       {
         text: 'View Spot',
         handler: () => {//push the DetailedSpotPage with params - spot and user id
           this.navCtrl.push(DetailedSpotPage, {spot: spot, id: this.user.id});
           console.log('Go to Post clicked');
         }
       },
       {
         text: 'Save Spot',
         handler: () => {
           console.log('Saved Spot clicked');
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

   actionSheet.present(); //display the action sheet
  }

  /*
  Scrolls the user back to the top of their screen.
  @parameters    none
  @return        nothing
  */
  scrollToTop() {
    this.content.scrollToTop();
  }


}
