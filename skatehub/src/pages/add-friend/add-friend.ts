import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the AddFriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage {
  users: any = [];
  searchTerm: any = "";
  temp: any = "";
  userResultArr: any = [];
  selectedUsers: any = [];
  selectedUsersString: any = "";

  //Send Request
  recipients: any = [];
  id: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
      public authProvider: AuthProvider, public toastCtrl: ToastController,
      public oneSignal: OneSignal) {
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
    this.authProvider.loadUser();
    this.id = this.authProvider.user._id;
    this.getUsers();
  }

  // openThreadPage(){
  //   this.navCtrl.push(ThreadPage, {id: this.authProvider.user.id, recipients: this.selectedUsers});
  // }

  getUsers(){
    this.authProvider.getAllUsers().subscribe((data)=>{
      if(data.success){
        this.users = data.users.filter(user => {
          // console.log(user.friends);
          let arr = user.friends.filter(friend => friend.sender == this.id || friend.id == this.id);
          if(user._id != this.id && arr.length == 0){
            // console.log("true");
            return true;
          }
          else {
            // console.log("false");
            return false;
          }
        });
        // console.log(this.users);
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

  sendRequest(){
    //TODO attach an id obj if there's already a thread made

    let friendObj = {
      id: this.id,
      recipients: this.selectedUsers
    };
    this.authProvider.friendRequest(friendObj).subscribe((data) => {
      if(data.success){
          console.log("Success");
          let toast = this.toastCtrl.create({
            message: "Successfully sent friend request",
            position: "top",
            showCloseButton: true,
            dismissOnPageChange: true
          });
          toast.present().then(() => {
            setTimeout(() => {
              toast.dismiss();
            }, 2000);
          });
          this.authProvider.getOneSignalDevices().subscribe((results) => {
            // console.log(results);
            // console.log("RECEIPIENT");
            // console.log(recipient);
            let len = results.total_count;
            let recLen = this.selectedUsers.length;
            let destinationIds = [];
            for(let i = 0; i<recLen; i++){
              for(let j = 0; j<len; j++){

                if(results.players[j].tags.user_id == this.selectedUsers[i]._id){
                  // let destinationId = results.players[i].tags.player_id;
                  // console.log("DID THIS CODE EVEN RUN???");
                  destinationIds.push(results.players[i].id);
                  // console.log(destinationIds);
                  break;
                }
              }
            }

            //TODO send notification
            console.log(destinationIds);
            let notificationObj: OSNotification = {
                headings: {en: "New Friend Request"},
                isAppInFocus: true,
                shown: true,
                data: {type: "friend"},
                payload: {
                  //id of the template for a new request
                  notificationID: "fe62f88f-dec5-48d0-97c3-ebbd2172e010",
                  title: "New Friend Request",
                  body: "You have a new friend request.",
                  sound: "",
                  actionButtons: [],
                  rawPayload: ""
                },
                displayType: 1,
                contents: {en: this.authProvider.user.username+" has sent you a friend request."},
                include_player_ids: destinationIds
              };
            this.oneSignal.postNotification(notificationObj)
                          .then((someData) => {
                            console.log(someData);
                          })
                          .catch((someErr) => {
                            console.log(someErr);
                          })

          });
        }
        else {
          console.log("Ultimate Failure/Vegeta");
        }
    })
    console.log(friendObj);
  }
}
