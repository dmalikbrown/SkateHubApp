import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { SpotsProvider } from '../../providers/spots/spots';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  spots: any = [];
  users: any = [];
  user: any;
  searchTerm: any;
  userResultArr: any = [];
  spotsResultArr: any = [];
  start: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider, public spotsProvider: SpotsProvider) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SearchPage');
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
    if(this.authProvider.user){
      this.user = this.authProvider.user;
      // console.log(this.user);
    }
    else{
      this.user = this.navParams.data;
      // console.log(this.user);
    }
    this.getUsers();
    this.getSpots();
  }
  getSpots(){
    this.spotsProvider.getAllSpots().subscribe((data) => {
      if(data.success){
        this.spots = data.spots;
      }
      else{
        //TODO error check;
      }
    });
  }
  getUsers(){
    this.authProvider.getAllUsers().subscribe((data)=>{
      if(data.success){
        this.users = data.users;
      }
      else {
        //TODO error check;
      }
    });
  }
  filter(){
    this.filterUsers();
    this.filterSpots();
  }
  filterUsers() {
    this.start = false;
    if(this.searchTerm && this.searchTerm.trim() != ''){
      this.userResultArr = this.users.filter(user => user.username.includes(this.searchTerm.toLowerCase()) || user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
    else{
      this.userResultArr = [];
    }
 }
 filterSpots(){

   this.start = false;
   if(this.searchTerm && this.searchTerm.trim() != ''){
     this.spotsResultArr = this.spots.filter(spot => spot.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
   }
   else{
     this.spotsResultArr = [];
   }
 }


}
