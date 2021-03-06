import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from '../../providers/spots/spots';
import { InviteProvider } from '../../providers/invite/invite';
import { SeshesPage } from '../../pages/seshes/seshes';
import { DetailedSpotPage } from '../../pages/detailed-spot/detailed-spot';
// import { SavedSpotsPage } from '../../pages/saved-spots/saved-spots'

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
  pos: any;
  spotsArr: any = [];
  allSessions: any = [];
  sessions: any = [];
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public spotsProvider: SpotsProvider,
              public authProvider: AuthProvider, public inviteProvider: InviteProvider) {
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
      styles:  [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#387fe5"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2e67b9"
      },
      {
        "saturation": -10
      },
      {
        "lightness": -45
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#fd0048"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#416aa3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#387fe5"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#387fe5"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]

    });
    let infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.pos = {
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
          let marker = new google.maps.Marker({
            //icon: 'http://maps.google.com/mapfiles/ms/icons/man',
            icon: icon,
            position: this.pos,
            map: this.map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            label: {
              text: username,
              fontFamily: 'sans-serif',
              color: 'white'
              }
          })

          //sets position of infoWindow
          infoWindow.setPosition(this.pos);

          //when the marker is clicked, open infoWindow
          // marker.addListener('click', () => {
          //   infoWindow.open(this.map, marker);
          // })

          //JSON stringify to print pos object in infoWindow
          infoWindow.setContent(JSON.stringify(this.pos));
          console.log(this.pos);

          // infoWindow.open(this.map);

          this.map.setCenter(this.pos);

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
  // openSeshPage(){
  //   this.navCtrl.push(SeshesPage);
  //
  // }
//TODO Pull spots arr loop through array and add markers
//OR make this below function to have the param spot and Call
//When a spot is saved or posted
ionViewDidEnter(){

  //TODO load all invites (sessions)
  this.loadInfo();
}
loadInfo(){
  //TODO change color of marker if the user that created a session or spot is viewing map
  this.user = this.authProvider.user;
  this.inviteProvider.getAllInvites(this.authProvider.token).subscribe((moreData)=> {
    if(moreData.success){
      this.allSessions = moreData.invites;
      console.log(this.allSessions);
      this.spotsProvider.getAllSpots().subscribe((data ) => {
        if(data.success){

          this.spotsArr = data.spots;

          let len = this.allSessions.length;
          for(let i = 0; i < len; i++){
            let hasJoined = false;
            let index = this.spotsArr.findIndex(spot => spot._id == this.allSessions[i].spot);
            // console.log(this.spotsArr[index]);
            if(index > -1 && this.allSessions[i].active){
              console.log("We have a session");
              let userIndex = this.allSessions[i].accepted.findIndex(acceptVal => acceptVal.id == this.user._id);
              if(userIndex > -1) hasJoined = true;
              this.allSessions[i].name = this.spotsArr[index].name;
              this.addSpotMarker(this.spotsArr[index].coordinates,"session",this.allSessions[i], hasJoined);
              this.spotsArr.splice(index,1);
            }
          }
          let spotLen = this.spotsArr.length;
          for(let j = 0; j< spotLen; j++){
            console.log(this.spotsArr[j]);
            if(this.spotsArr[j].coordinates){
              this.addSpotMarker(this.spotsArr[j].coordinates, "spot", this.spotsArr[j], false);
            }
          }




          // let len = this.spotsArr.length;
          // for(let i = 0; i < len; i++){
          //   for(let j = 0; j < this.allSessions.length; j++){
          //     let hasJoined = false;
          //     let index = this.spotsArr.findIndex(spot => spot._id == this.allSessions[j].spot);
          //     let userIndex = this.allSessions[j].accepted.findIndex(accept => accept.id == this.user._id);
          //     if(userIndex > -1){
          //       hasJoined = true;
          //     }
          //     console.log(this.allSessions[j].active);
          //     //TODO would check if the session is public or not
          //     if(index > -1 && this.allSessions[j].active){
          //       console.log("Session");
          //       this.allSessions[j].name = this.spotsArr[i].name;
          //       this.addSpotMarker(this.spotsArr[i].coordinates,"session",this.allSessions[j], hasJoined);
          //       // break;
          //     }
          //     else {
          //       this.addSpotMarker(this.spotsArr[i].coordinates, "spot", this.spotsArr[i], hasJoined);
          //       // break;
          //     }
          //   }
          // }
        }
        else{
          console.log("NAW FAM TRY THAT SHIT AGAIN AINT NO SPOTS BISH")
        }
      });
    }
  });

}

addSpotMarker(spotPos, type, obj, hasJoined){
  if(type == "session"){
    //TODO push detailed session page

    let marker = new google.maps.Marker({
      // icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      position: spotPos,
      map: this.map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      label: {
        text: obj.name,
        fontFamily: 'sans-serif',
        color: 'white'
      },
      sessionId: obj._id
    });
    console.log(spotPos);
    marker.addListener('click', ()=> {
      //TODO push detailed session page
      this.navCtrl.push(SeshesPage, {user: this.user, session: obj, hasJoined: hasJoined});
    });


  }
  else {
    //TODO Push detailed spot page

    let marker = new google.maps.Marker({
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      position: spotPos,
      map: this.map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      label: {
        text: obj.name,
        fontFamily: 'sans-serif',
        color: 'white'
      }
    });
    marker.addListener('click', ()=> {
      //TODO push detailed spot page
        this.navCtrl.push(DetailedSpotPage, {spot: obj, id: this.user._id});
      });
  }
}

}
