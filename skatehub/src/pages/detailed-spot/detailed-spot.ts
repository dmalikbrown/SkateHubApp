
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from './../../providers/spots/spots';
import { CommentProvider } from './../../providers/comment/comment';
import { ReportProvider } from './../../providers/report/report';
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
  rating: number;
  comment: any;
  report: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation,
  public launchNavigator: LaunchNavigator, public actionSheet: ActionSheetController, public alertCtrl: AlertController,
  public spotsProvider: SpotsProvider, public commentProvider: CommentProvider, public reportProvider: ReportProvider,
  public oneSignal: OneSignal, public authProvider: AuthProvider) {
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
    console.log("ionViewDidLoad", this.spot);
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
   * Once the save button is clicked, both the rating that
   * was selected with the slide bar
   * and the comment that the user put into the text area
   * is saved.
   *
   */
  saveButton(){
	 let ratingObj = {
       id: this.spot._id,
       type: "rate",
       rating: this.rating
	 };

     let commentObj = {
	     userId: this.spot.userId,
       username: this.spot.username,
       spotId: this.spot._id,
       comment: this.comment
	 };
	 /*
	  * After creating our rate obj and comment obj,
	  * we can have some fun.
	  *
	  * First, we create the comment. Comments have their
	  * own schema because they can get complex if many users
	  * decide to comment on a spot.
	  */
	 this.commentProvider.addComment(commentObj).subscribe((data) => {
	   if(data.success){
	     let spotComment = {
           id: this.spot._id,
           type: "comment",
           comment: data.comment._id
		 };
		 /*
		  * After successfully saving the comment to the db, we
		  * can update the spot with the id of the newly created
		  * comment.
		  */
		 console.log("Successfully commented on spot");
	     this.spotsProvider.update(spotComment).subscribe((data) => {
			  if(data.success){
          this.authProvider.getOneSignalDevices().subscribe((results) => {
            // console.log(results);
            // console.log("RECEIPIENT");
            // console.log(recipient);
            let recipient = this.spot.userId;
            let len = results.total_count;
            let destinationId = "";
            for(let i = 0; i<len; i++){
              if(results.players[i].tags.user_id == recipient){
                // let destinationId = results.players[i].tags.player_id;
                // console.log("DID THIS CODE EVEN RUN???");
                destinationId = results.players[i].id;
                console.log(destinationId);
                break;
              }
            }
            //TODO send notification
            console.log(destinationId);
            let notificationObj: OSNotification = {
                headings: {en: "New Comment"},
                isAppInFocus: true,
                shown: true,
                data: {type: "comment"},
                payload: {
                  //id of the template for a new message
                  notificationID: "ada9fc69-030b-44e7-aba5-104c6b6b4e77",
                  title: "New Comment",
                  body: "some new comment",
                  sound: "",
                  actionButtons: [],
                  rawPayload: ""
                },
                displayType: 1,
                contents: {en: this.authProvider.user.username+" commented on your spot."},
                include_player_ids: [destinationId]
              };
            this.oneSignal.postNotification(notificationObj)
                          .then((someData) => {
                            console.log(someData);
                            let notification = {
                              type: "comment",
                              description: this.authProvider.user.username+" commented on your spot.",
                              sender: this.authProvider.user._id,
                              receiver: recipient,
                              obj: data.comment._id
                            };
                            let edit = {
                              type: "notification",
                              notification: notification,
                              id: recipient,
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
			    console.log("Successfully saved comment id to Spot");
			  } else {
			    console.log("Error when saving comment id to Spot");
			  }
		 });
	   } else {
		   console.log("Error when commenting on spot");
	   }
	 });
     this.spotsProvider.update(ratingObj).subscribe((data) => {
       if(data.success){
         console.log("Successfully rated spot");
         this.spot.rating.push(this.rating);
			   //console.log("this.spot.rating: ", this.spot.rating);
	   } else {
         console.log("Error when rating spot", data);
       }
	 });
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
          name: 'reportSpot',
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
			let reportObj = {
              userId: this.spot.userId,
              spotId: this.spot._id,
              report: data.reportSpot
			};
			/*
			 * Adding the report to the spot.
			 */
		    this.reportProvider.addReport(reportObj).subscribe((data) =>{
              if(data.success){
                console.log("Successfully reported spot", data);
              } else {
                console.log("Error when reporting spot", data);
              }
            });
          }
        }
      ]
    });
    prompt.present();
  }
}
