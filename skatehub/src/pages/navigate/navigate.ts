import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';

/**
 * Generated class for the NavigatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


declare var google;

@Component({
  selector: 'page-navigate',
  templateUrl: 'navigate.html',
})
export class NavigatePage {


  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider) {
  }

  ionViewCanEnter() {
    this.authProvider.isValidToken().then((res) => {
         console.log("Already authorized");
        return true;
     }, (err) => {
         console.log("Not already authorized");
         return false;
     });
  }

  ionViewDidLoad() {
    this.initMap();
    console.log('ionViewDidLoad NavigatePage');
  }

  initMap(){
    google.maps.visualRefresh = true;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 42.360091, lng: -71.0963487},
      zoom: 20
    });
    let infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }

          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
          infoWindow.open(this.map);
          this.map.setCenter(pos);
        }, () => {
          this.handleLocationError(true, infoWindow, this.map.getCenter());

        });
    } else {
      this.handleLocationError(false, infoWindow, this.map.getCenter());
    }

  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(this.map);
  }





}
