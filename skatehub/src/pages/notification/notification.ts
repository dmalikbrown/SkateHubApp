import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  user: any;
  notifications: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider) {
  }

  ionViewDidEnter() {
    this.loadInfo();
    // console.log('ionViewDidLoad NotificationPage');
  }
  loadInfo(){
    this.user = this.authProvider.user;
    this.authProvider.getNotifications(this.user._id).subscribe((data)=>{
      if(data.success){
        this.notifications = data.notifications;
        this.loadUsers();
      }
    });
  }
  loadUsers(){
    let len = this.notifications.length;
    for(let i = 0; i<len; i++){
      this.authProvider.getUser(this.notifications[i].sender).subscribe((data)=>{
        if(data.success){
          console.log(data.user);
          this.notifications[i].user = data.user;
        }
        else {
          console.log(data.msg);
        }
      });
    }
  }

}
