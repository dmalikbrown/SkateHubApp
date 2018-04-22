
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { ProfilePage } from './../../pages/profile/profile';
import { DetailedUserPage } from './../../pages/detailed-user/detailed-user';
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
  commentArr: any = [];
  report: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation,
  public launchNavigator: LaunchNavigator, public actionSheet: ActionSheetController, public alertCtrl: AlertController,
  public spotsProvider: SpotsProvider, public commentProvider: CommentProvider, public reportProvider: ReportProvider,
  public oneSignal: OneSignal, public authProvider: AuthProvider, public toastCtrl: ToastController) {
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
    this.loadInfo();
    // console.log("ionViewDidLoad", this.spot);
    if (this.spot.userId == this.navParams.get('id'))
    {
		    this.isUser = true;
    }
    else
    {
        this.isUser = false;
    }
  }
  loadInfo(){
    this.loadComments();
  }
  loadComments(){
    this.commentProvider.getAllComments(this.spot._id).subscribe((data)=> {
      if(data.success){
        this.commentArr = data.comment;
        // console.log(data.comment);
      }
      else {
        console.log(data.msg);
      }
    })
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
           this.saveSpt("saved",this.spot);
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
  toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText){
    let toast = this.toastCtrl.create({
      message: msg,
      position: pos,
      cssClass: cssClass,
      showCloseButton: showCloseButton,
      closeButtonText: closeButtonText,
      dismissOnPageChange: true
    });
    //Fixes the bug issue #62 .. gotta call dismiss function at some point
    toast.present().then(() => {
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    });
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
  openDetailedAction(spot){
    let actionSheet = this.actionSheet.create({
     buttons: [
       {
         text: 'Save Spot',
		   handler: () => {
             this.saveSpt('savedSpots', spot);
             console.log('Saved Spot clicked');
         }
       },
       {
         text: 'Rate Spot',
         handler: () => {//push the DetailedSpotPage with params - spot and user id
           //TODO
           console.log('rate Spot');
         }
       },
       {
         text: 'Comment on Spot',
         handler: () => {//push the DetailedSpotPage with params - spot and user id
           //TODO
           console.log('Comment on Spot');
         }
       },
       {
         text: 'Report Spot',
         handler: () => {//push the DetailedSpotPage with params - spot and user id
           //TODO
           console.log('report Spot');
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
   * Once the save comment button is clicked,
   * the comment that the user put into
   * the text area is saved.
   */
  saveComment(){
    let commentObj = {
      userId: this.authProvider.user._id,
      username: this.authProvider.user.username,
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
	   console.log("Successfully created a comment!");
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
				/*
				 * Instead of putting this higher up, I choose to throw a toast at a user
				 * here because all we really care about is whether or not the id
				 * of the comment is saved to the spot.
				 */
                let msg = "Successfully commented on spot!";
                let pos = "top";
                let cssClass = "success";
                let showCloseButton = true;
                let closeButtonText = "Ok";
                this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
			  } else {
                console.log("Error when saving comment id to Spot");
                let msg = "Error when commenting on spot!";
                let pos = "top";
                let cssClass = "warning";
                let showCloseButton = true;
                let closeButtonText = "Ok";
                this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
			  }
		 });
	   } else {
         console.log("Error when creating a comment!");
         let msg = "Please try commenting again!";
         let pos = "top";
         let cssClass = "warning";
         let showCloseButton = true;
         let closeButtonText = "Ok";
         this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
	   }
	 });
  }

  /*
   * Created saveRating so the code can be more readable.
   * saveComment is a big chunk of code.
   * Once the saveRating button is clicked, the rating
   * the user supplied is saved.
   */

  saveRating(){
    if (this.rating == null){
      this.rating = 0;
	}
	let ratingObj = {
       id: this.spot._id,
       type: "rate",
       rating: this.rating
	};

    this.spotsProvider.update(ratingObj).subscribe((data) => {
      if(data.success){
        console.log("Successfully rated spot");
        this.spot.rating.push(this.rating);
        let msg = "Successfully rated spot!";
        let pos = "top";
        let cssClass = "success";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
	  } else {
        console.log("Error when rating spot", data);
        let msg = "Error when rating spot!";
        let pos = "top";
        let cssClass = "warning";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
	  }
	 });
  }

  avatarClick(){
    if(this.authProvider.user._id == this.spot.userId){
      this.navCtrl.push(ProfilePage);
 	  console.log('Leaving HomePage, going to ProfilePage');
    } else if(this.spot.userId) {
       console.log('Leaving HomePage, going to DetailedUserPage');
       this.navCtrl.push(DetailedUserPage, {username: this.spot.username, id: this.spot.userId});
    } else {
   	   console.log('Error: HomePage, attempting push to DetailedUserPage');
    }
  }

  /*
   * This is opens up a prompt to let the user
   * report the spot.
   */
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Save Report',
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
              userId: this.authProvider.user._id,
              spotId: this.spot._id,
              report: data.reportSpot
            };
            /*
             * Adding the report to the spot.
             */
		    this.reportProvider.addReport(reportObj).subscribe((data) =>{
              console.log(data);
              if(data.success){
                console.log("Successfully reported spot", data);
                let msg = "Successfully reported spot!";
                let pos = "top";
                let cssClass = "success";
                let showCloseButton = true;
                let closeButtonText = "Ok";
                this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
              } else {
                console.log("Error when reporting spot!", data);
                let msg = "Error when reporting spot!";
                let pos = "top";
                let cssClass = "warning";
                let showCloseButton = true;
                let closeButtonText = "Ok";
                this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
              }
            });
          }
        }
      ]
    });
    prompt.present();
  }
}
