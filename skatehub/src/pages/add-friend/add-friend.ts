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
  ableToStartThread: boolean = false;

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
                  console.log("DID THIS CODE EVEN RUN???");
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
              let someLen = this.selectedUsers.length;
              console.log("PRINTING THE LENGTH");
              console.log(someLen);
              for(let k = 0; k<someLen; k++){
                let notification = {
                  type: "friend",
                  description: this.authProvider.user.username+" has sent you a friend request.",
                  sender: this.authProvider.user._id,
                  receiver: this.selectedUsers[k]._id,
                  obj: this.selectedUsers[k]._id
                };
                let edit = {
                  type: "notification",
                  notification: notification,
                  id: this.selectedUsers[k]._id,
                };
                console.log("EDIT OBJ");
                console.log(edit);
                this.authProvider.update(edit).subscribe((ret)=> {
                    if(ret.success){
                      //do nothing
                    }
                    else {
                      console.log(ret.msg);
                    }
                });
              }
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
