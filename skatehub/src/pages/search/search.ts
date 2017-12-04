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
  /*
  Initializes the user object. Makes function call to getUsers and getSpots.
  @parameters    none
  @return        nothing
  */
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
  /*
  Makes a server call to retrieve all the spots in the spots Collection.
  @parameters    none
  @return        nothing
  */
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
  /*
  Makes a server call to retrieve all the users in the users Collection.
  @parameters    none
  @return        nothing
  */
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
  /*
  Function is called from the html when the user is typing. Makes function calls
  to filterUsers and filterSpots.
  @parameters    none
  @return        nothing
  */
  filter(){
    this.filterUsers();
    this.filterSpots();
  }
  /*
  Filters the users array using the searchTerm checking against users' username
  and fullName. Sets the userResultArr to that filter.
  @parameters    none
  @return        nothing
  */
  filterUsers() {
    this.start = false;
    if(this.searchTerm && this.searchTerm.trim() != ''){
      this.userResultArr = this.users.filter(user => user.username.includes(this.searchTerm.toLowerCase()) || user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
    else{
      this.userResultArr = [];
    }
 }
 /*
 Filters the spots array using the searchTerm checking against spots' name.
 Sets the spotsResultArr to that filter.
 @parameters    none
 @return        nothing
 */
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
