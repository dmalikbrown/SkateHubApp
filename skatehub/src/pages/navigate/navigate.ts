import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from '../../providers/spots/spots';
import { SeshesPage } from '../../pages/seshes/seshes';
import { SavedSpotsPage } from '../../pages/saved-spots/saved-spots'

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
  spotsArr: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public spotsProvider: SpotsProvider,
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
      zoom: 15,
      // there are different map styles, this is night mode
      styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    });
    let infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          /*
          Check that the authProvider still exists because if a user taps the
          Navigate tab then the Profile tab and logs out fast enough, error is
          thrown. Call back isn't fast enough.
          */
          let username = "";
          if(this.authProvider.user){
            username = this.authProvider.user.username;
          }
          let icon = {
            url: this.authProvider.user.avatar,
            scaledSize: new google.maps.Size(40, 40)
          }
          var marker = new google.maps.Marker({
            //icon: 'http://maps.google.com/mapfiles/ms/icons/man',
            icon: icon,
            position: pos,
            map: this.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            label: {
              text: username,
              fontFamily: 'sans-serif',
              color: 'white'
              }
          })

          //sets position of infoWindow
          infoWindow.setPosition(pos);

          //when the marker is clicked, open infoWindow
          marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
          })

          //JSON stringify to print pos object in infoWindow
          infoWindow.setContent(JSON.stringify(pos));
          console.log(pos);

          // infoWindow.open(this.map);

          this.map.setCenter(pos);

          //HTML5 geolocation checking
        }, () => {
          this.handleLocationError(true, infoWindow, this.map.getCenter());

        });
    } else {
      // browser doesn't support geolocation
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
  openSeshPage(){
    this.navCtrl.push(SeshesPage);

  }
//TODO Pull spots arr loop through array and add markers
//OR make this below function to have the param spot and Call
//When a spot is saved or posted
ionViewDidEnter(){
this.spotsProvider.getAllSpots().subscribe((data ) => {
  if(data.success){
    this.spotsArr = data.spots;
    let len = this.spotsArr.length;
    for(let i = 0; i < len; i++){
      this.addSpotMarker(this.spotsArr[i].coordinates,this.spotsArr[i]);
    }
  }
  else{
    console.log("NAW FAM TRY THAT SHIT AGAIN AINT NO SPOTS BISH")
  }
})
}

addSpotMarker(spotPos,spot){
var marker = new google.maps.Marker({
  icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  position: spotPos,
  map: this.map,
  draggable: true,
  animation: google.maps.Animation.DROP,
  label: {
    text: spot.name,
    fontFamily: 'sans-serif',
    color: 'white'
    }
})
}

}
