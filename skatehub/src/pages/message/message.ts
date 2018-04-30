import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ThreadPage } from '../../pages/thread/thread';
/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  users: any = [];
  searchTerm: any = "";
  temp: any = "";
  count: any = 0;
  userResultArr: any = [];
  selectedUsers: any = [];
  selectedUsersString: any = "";
  ableToStartThread: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
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
    this.getUsers();
  }

  openThreadPage(){
    this.navCtrl.push(ThreadPage, {id: this.authProvider.user._id, recipients: this.selectedUsers});
  }

  getUsers(){
    this.authProvider.getAllUsers().subscribe((data)=>{
      if(data.success){
        this.users = data.users;
        let i = this.users.findIndex(user => user._id == this.authProvider.user._id);
        if(i > -1){
          this.users.splice(i,1);
        }
      }
      else {
      	console.log("SearchPage Error, couldn't retrieve users from server");
      }
    });
  }
  removeFromSearchList(searchUser){
    searchUser.checked = false;
    let i = this.selectedUsers.findIndex(s => s._id == searchUser._id);
    if(i > -1 ){
      this.selectedUsers.splice(i, 1);
    }
  }
  toggleUser(userObj){
    if(!userObj.checked){
      this.ableToStartThread = false;
      userObj.checked = true;
      this.searchTerm = "";
      // this.searchTerm += this.temp+userObj.username+", ";
      // this.temp = this.searchTerm;
      this.selectedUsers.push(userObj);
    }
  }

  filter(bool: boolean = false){
    this.filterUsers(bool);
  }
  /*
  Filters the users array using the searchTerm checking against users' username
  and fullName. Sets the userResultArr to that filter.
  @parameters    none
  @return        nothing
  */
  filterUsers(bool: boolean) {
    let search = this.searchTerm;
    if(search && search.trim() != ''){
      this.userResultArr = this.users.filter(user => this.startsWith(search.toLowerCase(), user.username.toLowerCase()) || this.startsWith(search.toLowerCase(), user.fullName.toLowerCase()));
    }
    else{
      this.userResultArr = [];
    }
    // console.log(this.userResultArr);
 }
 startsWith(str, item){
   return str.substring( 0, str.length ) === item.substring(0, str.length);
 }
 checkSelectedUsers(lastUser){
   console.log("LAST USER IS : "+ lastUser);
   let index = this.selectedUsers.findIndex(user => user.username == lastUser.toLowerCase() || user.fullName.toLowerCase() == lastUser.toLowerCase());
   if(index > -1){
     console.log("SPLICE");
     this.selectedUsers.splice(index, 1);
   }
 }
}
