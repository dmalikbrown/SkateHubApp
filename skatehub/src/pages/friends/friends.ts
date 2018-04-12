import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddFriendPage } from '../../pages/add-friend/add-friend';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {

  friendType: any;
  requests: any = [];
  friends: any;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider) {
    this.user = this.navParams.get('user');
    this.filters();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FriendsPage');
  }

  filters(){
    if(this.user.friends){
      // let len = this.user.friends;
      let dummyReq = [];
      let dummyFriends = [];
      dummyReq = this.user.friends.filter((friend) => friend.request == false && friend.sender != this.user._id);
      dummyFriends = this.user.friends.filter((friend) => friend.request == true);
      // console.log(dummyReq);
      let reqL = dummyReq.length;
      let fL = dummyFriends.length;

      for(let i = 0; i<reqL; i++){
        this.getUsersFromArr(dummyReq[i].sender, 'request');
      }
      for(let i = 0; i<fL; i++){
        let idVal = "";
        if(dummyFriends[i].id == this.user._id){
          idVal = dummyFriends[i].sender;
        }
        else {
          idVal = dummyFriends[i].id;
        }
        this.getUsersFromArr(idVal, 'friends');
      }

    }
  }

  getUser(){
    // console.log(id);
    this.authProvider.getUser(this.user._id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
        this.authProvider.updateUser(this.user);
        this.user = data.user;
        this.filters();
      }
      else {
        //TODO Error alert
        console.log("WDAT FUCK BITCH");
      }
    });
  }

  getUsersFromArr(id, type){
    if(!id) return;
    this.authProvider.getUser(id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
        if(type == "request"){
          this.requests.push(data.user);
        }
        else {
          this.friends.push(data.user);
        }
      }
      else {
        console.log("error bitchhhh");
        //TODO Error alert
        // let alert = this.alertCtrl.create({
        //   title: 'Error',
        //   subTitle: data.msg,
        //   buttons: ["Dismiss"]
        // });
        // alert.present();
        // return false;
      }
    });
  }

  acceptFriendRequest(request){
    let obj = {
      id: this.user._id,
      friend: request,
      type: "accept-request"
    };
    this.authProvider.update(obj).subscribe((data) => {
      if(data.success){
        console.log(data.msg);
        this.requests = [];
        this.friends = [];
        this.getUser();
      }
      else {
        console.log("yO BITCH");
      }
    });
  }

  openAddFriendsPage(){
    this.navCtrl.push(AddFriendPage);
  }

}
