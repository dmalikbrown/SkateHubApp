import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  commentsArr: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
		      public spotsProvider: SpotsProvider, public commentProvider: CommentProvider,
              public authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentsPage');
  }
  ionViewDidEnter() {
	this.spot = this.navParams.get('spot');	  
	//this.spots = this.user.spots;
    for(const id of this.spot.comment){
	  this.commentProvider.getCommentById(id).subscribe((data) => {
		if(data.success){
          
          this.commentsArr.push(data.comment);
	      console.log("Success", data.comment);
	    }
		else {
		  console.log("Error getting comment");
		}
	  });
	}
  }

}
