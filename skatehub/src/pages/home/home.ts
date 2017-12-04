import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, AlertController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from './../../providers/spots/spots';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';

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
            public geolocation: Geolocation) {
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
  ionViewDidEnter(){
    //console.log(this.authProvider.user);
    this.grabPosts();
    if(this.authProvider.user){
      this.user = this.authProvider.user;
      console.log(this.user);
    }
    else{
      this.user = this.navParams.data;
      console.log(this.user);
    }

  }

  grabPosts(){
    //TODO server call to get posts
    this.spotsProvider.getAllSpots().subscribe((data) =>{
      if(data.success){
        this.spots = data.spots.reverse();
        this.spotsVarHolder = data.spots.reverse();
        if(this.spots.length == 0){
          this.noSpots = true;
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
  filterByState(){
    if(this.state == 'all'){
      this.spots = this.spotsVarHolder;
      return;
    }
    this.spots = this.spotsVarHolder.filter(x => this.parseStateFromSpot(x) == this.state);
    if(this.spots.length == 0){
      this.noSpots = true;
    }
    else {
      this.noSpots = false;
    }
  }
  parseStateFromSpot(spot){
    let location = spot.location;
    let state = location.substring(location.lastIndexOf(',')+1).replace(/ /g, "");
    return state;
  }

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

  scrollToTop() {
    this.content.scrollToTop();
  }
}
