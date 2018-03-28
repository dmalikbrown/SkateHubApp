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
      }
      else {
      	console.log("SearchPage Error, couldn't retrieve users from server");
      }
    });
  }
  toggleUser(userObj){
    if(userObj.checked){
      //TODO remove user after being checked
      // console.log("toggle false");
      // let index = this.userResultArr.filter((user) => userObj._id == userObj._id);
      // if(index < 0) {
      //   return;
      // }
      // else {
      //   userObj.checked = false;
      //   let arr = this.temp.split(',');
      //   console.log(arr);
      //   let i = arr.filter((username) => username == userObj.username);
      //   console.log(i);
      //   if(i < 0) {
      //     return;
      //   }
      //   else {
      //     arr.splice(i,1);
      //     console.log(arr);
      //     this.searchTerm = arr.join();
      //   }
      }
      // let len = this.userResultArr.length;
      // for(let i = 0; i< len; i++){
      //   this.userResultArr[i].checked = false;
      // }
    else if(!userObj.checked){
      this.ableToStartThread = false;
      userObj.checked = true;
      this.searchTerm = "";
      this.searchTerm += this.temp+userObj.username+", ";;
      this.temp = this.searchTerm;
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
    if(bool){
      search = search.substring(search.lastIndexOf(',')+1).replace(/ /g,'');
    }
    if(search && search.trim() != ''){
      this.userResultArr = this.users.filter(user => user.username.includes(search.toLowerCase()) || user.fullName.toLowerCase().includes(search.toLowerCase()));
    }
    else{
      this.userResultArr = [];
    }
    // console.log(this.userResultArr);
 }
}
