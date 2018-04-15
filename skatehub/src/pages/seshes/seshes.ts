import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { SpotsProvider } from '../../providers/spots/spots';
import { AuthProvider } from '../../providers/auth/auth';
import { InviteProvider } from '../../providers/invite/invite';
/**
 * Generated class for the SeshesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-seshes',
  templateUrl: 'seshes.html',
})
export class SeshesPage {


  user: any;
  spot: any;
  session: any;
  hasJoined: any;
  isUser: boolean = false;
  acceptedUsers: any =[];


  constructor(public navCtrl: NavController, public navParams: NavParams,
            public spotsProvider: SpotsProvider, public authProvider: AuthProvider,
            public inviteProvider: InviteProvider, public launchNavigator: LaunchNavigator,
            public geolocation: Geolocation) {
  }

  ionViewDidEnter() {
    this.loadInfo();
  }
  loadInfo(){
    this.user = this.navParams.get('user');
    this.session = this.navParams.get('session');
    this.checkUser();
    this.hasJoined = this.navParams.get('hasJoined');
    if(!this.session.spot._id){
      this.loadSpot();
    }
    else {
      this.spot = this.session.spot;
    }
    this.loadUsers();
  }
  loadSpot(){
    this.spotsProvider.getSpotById(this.session.spot).subscribe((data)=> {
      if(data.success){
        this.spot = data.spot;
      }
      else {
        console.log(data.msg);
      }
    });
  }
  loadUsers(){
    //TODO find a way to query an array with looping
    let len = this.session.accepted.length;
    for(let i = 0; i<len; i++){
      this.authProvider.getUser(this.session.accepted[i].id).subscribe((data)=>{
          if(data.success){
            this.acceptedUsers.push(data.user);
          }
          else {
            console.log(data.msg);
          }
      });
    }
  }
  leaveSession(){
    console.log("leaving");
  }
  joinSession(){
    //TODO add user to the session clicked
    let userObj = {
      inviteId: this.session._id,
      userId: {id: this.user._id}
    };
    this.inviteProvider.acceptInvite(userObj, this.authProvider.token).subscribe((data) => {
      if(data.success){
        //TODO redo the logic behind invites
        let editObj = {
          type: "session",
          inviteObj: {id: this.session._id},
          id: this.user._id
        };
        this.authProvider.update(editObj).subscribe((moreData) => {
          if(moreData.success){
            //TODO toast controller
            //maybe reload some stuff
            this.navCtrl.pop();
          }
          else {
            console.log(moreData.msg);
          }
        });
      }
      else {
        console.log(data.msg);
      }
    });
  }
  openNavigation(){
    // console.log(coordinates);
    let destination = [this.spot.coordinates.lat, this.spot.coordinates.lng];
    let curr = [];
    this.geolocation.getCurrentPosition().then((resp) => {
      curr = [resp.coords.latitude, resp.coords.longitude];
    });
    let options: LaunchNavigatorOptions = {
      start: curr
    };
    this.launchNavigator.navigate(destination, options)
        .then(
            success => console.log('Launched navigator'),
            error => console.log('Error launching navigator: ' + error)
    );
  }

  checkUser(){
    if(this.session.sender == this.user._id){
      this.isUser = true;
    }
    else {
      this.isUser = false;
    }
  }
}
