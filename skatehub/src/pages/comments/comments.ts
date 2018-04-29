import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { SpotsProvider } from './../../providers/spots/spots';
import { CommentProvider } from './../../providers/comment/comment';
import { AuthProvider } from './../../providers/auth/auth';
/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  spot: any;
  id: any;
  user: any;
  comment: any;
  commentsArr: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
		      public spotsProvider: SpotsProvider, public commentProvider: CommentProvider,
              public authProvider: AuthProvider, public oneSignal: OneSignal,
              public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentsPage');
  }
  ionViewDidEnter() {
    this.loadInfo();
  }
  loadInfo(){
    this.spot = this.navParams.get('spot');
    console.log(this.spot._id);
      this.commentProvider.getAllComments(this.spot._id).subscribe((data) => {
        if(data.success){
          this.commentsArr = data.comment;
	    }
        else {
          console.log("Error getting comment");
        }
      });
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
      this.loadInfo();
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
	   this.spotsProvider.update(spotComment).subscribe((moreData) => {
	     if(moreData.success){
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
                    //send notification
                    this.oneSignal.postNotification(notificationObj)
                                  .then((someData) => {
                                    console.log(someData);

                                  })
                                  .catch((someErr) => {
                                    console.log(someErr);
                                  })
                  }
                  else {
                    console.log(ret.msg);
                  }
              });


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

}
