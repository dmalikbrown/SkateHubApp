import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, AlertController,
  ActionSheetController, PopoverController, Events} from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from './../../providers/spots/spots';
import { SpotTypeFilterProvider } from './../../providers/spot-type-filter/spot-type-filter';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { DetailedSpotPage } from '../../pages/detailed-spot/detailed-spot';
import { InboxPage } from '../../pages/inbox/inbox';
import { FilterPage } from '../../pages/filter/filter';
import { DetailedUserPage } from '../../pages/detailed-user/detailed-user';
import { ProfilePage } from '../../pages/profile/profile';
import { CommentsPage } from '../../pages/comments/comments';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;


  user: any;
  state: any;
  spots: any = [];
  savedSpots: any;
  spotsVarHolder: any = [];
  noSpots: boolean;
  start: any = "";
  destination: any = "";
  filterArray: any = [];

  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
            public navParams: NavParams, public spotsProvider: SpotsProvider,
            public alertCtrl: AlertController, public launchNavigator: LaunchNavigator,
            public geolocation: Geolocation, public actionSheet: ActionSheetController,
            public popoverCtrl: PopoverController, public event: Events,
            public spotTfp: SpotTypeFilterProvider, public oneSignal: OneSignal) {

              //whenever an event is published with the name 'filter:event', return
              //this code... when a user filters, run this code essentially
              this.event.subscribe('filter:event', (data) => {
                this.filterArray = data;
                this.spots = this.filterSpots(data);
              });
              this.event.subscribe('newPost:event', (data) => {
                if(data){
                  this.grabPosts();
                }
                else {
                  //Hmm
                }
              });

  }
  /*
  Performs a 'filter' function on the spotsVarHolder (the array that will always
  contain all the spots). The function that is passed to the 'filter' function
  loops thru each spot's types and compares them to the array of filter keywords.
  If the filter keywords are 'stairs' and 'ramp', then only those spots that have
  a type 'stairs' AND 'ramp' will be returned.
  @parameters    array of strings (filter keywords)
  @return        array of spots
  */
  filterSpots(filterArray){
    //if the filter has no keywords, return all the spots
    if(filterArray.length <=0) return this.spotsVarHolder;

    //return an array that satisfies the conditions
    return this.spotsVarHolder.filter(function(spot){
      //filter function is gonna run on all the spots.

      let result = true; //result will be what's returned if the spot has the filter keywords
      let l = spot.types.length;
      let innerLen = filterArray.length;
      //gonna use this variable (count) to keep up with how many type filter keyword matches we have
      let count = 0;
      //outer loop is looping thru spot.types array
      //inner loop is looping thru filterArray (filter keywords)
      for(let i = 0; i<l; i++){
        //since the type that's stored to each spot is an
        //image url example: 'assets/imgs/stairs.png'
        //we need to parse the actual type ('stairs' in this case)
        //lastIndexOf('/')+1 starts at the last '/', and indexOf('.') grabs the only '.'
        // in the string which should be the only period.
        let type = spot.types[i].substring(spot.types[i].lastIndexOf('/')+1, spot.types[i].indexOf('.'));
        //if the type matches any of filter keywords, increment count and end the inner loop
        //proceed to the next type to check.
        for(let j = 0; j< innerLen; j++){
          if(type == filterArray[j]){
            count++;
            break;
          }
        }
      }
      //if the count is not equivalent to the filterArray length then that means
      //all of the filter keywords do not exist on this particular spot
      //so it should not be included in the new array that is filtered.
      if(count != filterArray.length){
        result = false;
      }
      //return the outcome
      return result;
    });
  }

  /*
  Push the InboxPage
  @parameters    none
  @return        nothing
  */
  openInbox(){
      this.navCtrl.push(InboxPage, {id: this.user._id});
  }

  /*
  Present the filter popover
  @parameters    event -> Don't know if it's needed
  @return        nothing
  */
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
    this.sendOneSignalTags();
  }
  ionViewDidLoad(){

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
        this.filterArray = this.spotTfp.getFilterItems();
        this.spots = this.filterSpots(this.filterArray);
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
  refresh(refresher){
    setTimeout(() => {
      this.grabPosts();
      refresher.complete();
    }, 1000);
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
      if(this.spots.length == 0){
        this.noSpots = true;
      }
      else {
        this.noSpots = false;
      }
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
  /* Saves the spot to the user that is currently logged in.
   * Only saves the spot id to the savedSpot field of
   * the User Schema.
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
        // console.log("Successfully saved spot");
        this.authProvider.getOneSignalDevices().subscribe((results) => {
          let len = results.total_count;
          let destinationId = "";
          for(let i = 0; i<len; i++){
            if(results.players[i].tags.user_id == spot.userId){
              destinationId = results.players[i].id;
              break;
            }
          }
          console.log(destinationId);
          let notificationObj: OSNotification = {
              headings: {en: ""},
              isAppInFocus: true,
              shown: true,
              data: {type: "saved"},
              payload: {
                //id of the template for a new message
                notificationID: "4b19b742-5509-4a06-bfeb-73da3286540f",
                title: "Spot Saved",
                body: "Someone has saved your spot.",
                sound: "",
                actionButtons: [],
                rawPayload: ""
              },
              displayType: 1,
              contents: {en: this.authProvider.user.username+" has saved your spot "+spot.name},
              include_player_ids: [destinationId]
            };
          this.oneSignal.postNotification(notificationObj)
                        .then((someData) => {
                          console.log(someData);
                          let notification = {
                            type: "saved",
                            description: this.authProvider.user.username+" has saved your spot "+spot.name,
                            sender: this.authProvider.user._id,
                            receiver: spot.userId,
                            obj: spot._id
                          };
                          let edit = {
                            type: "notification",
                            notification: notification,
                            id: spot.userId,
                          };
                          this.authProvider.update(edit).subscribe((ret)=> {
                              if(ret.success){
                                //do nothing
                              }
                              else {
                                console.log(ret.msg);
                              }
                          });
                        })
                        .catch((someErr) => {
                          console.log(someErr);
                        })

        });
      } else {
        console.log("Error when saving spot");
      }
    });

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
           this.navCtrl.push(DetailedSpotPage, {spot: spot, id: this.user._id});
           console.log('Go to Post clicked');
         }
       },
       {
         text: 'Save Spot',
		   handler: () => {
             this.saveSpt('savedSpots', spot);
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

  /*
  Pushes the user to the respective profile of the avatar clicked.
  @parameters 	 spot
  @return        ProfilePage or DetailedUserPage
  */
  avatarClick(spot){
    if(this.authProvider.user._id == spot.userId){
      this.navCtrl.push(ProfilePage);
 	  console.log('Leaving HomePage, going to ProfilePage');
    } else if(spot.userId) {
       console.log('Leaving HomePage, going to DetailedUserPage');
       this.navCtrl.push(DetailedUserPage, {username: spot.username, id: spot.userId});
    } else {
   	   console.log('Error: HomePage, attempting push to DetailedUserPage');
    }
  }

  sendOneSignalTags(){
    // this.authProvider.loadUser();
    // this.oneSignal.addSubscriptionObserver().subscribe((state) => {
    //   if (!state.from.subscribed && state.to.subscribed) {
    //     console.log("Subscribed for OneSignal push notifications!")
    //     // get player ID
    //     console.log(state.to.userId);
    //
    //     console.log(tags);
    //     this.oneSignal.deleteTags(["user_id", "user_email"]);
    //     this.oneSignal.sendTags(tags);
    //   }
    //   console.log("Push Subscription state changed: " + JSON.stringify(state));
    // });
    let tags = {
      user_id: this.user._id,
      user_email: this.user.email
    };
    console.log("sending tags");
    this.oneSignal.deleteTags(["user_id", "user_email"]);
    this.oneSignal.sendTags(tags);
  }

  openComments(spot){
    this.navCtrl.push(CommentsPage, {spot: spot});
  }
}
