import { Component, Input, ViewChild } from '@angular/core';

import { IonicPage, NavController, NavParams, ToastController, AlertController,
  App} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { EditPasswordPage } from '../../pages/edit-password/edit-password';
import { PrivacyPolicyPage } from '../../pages/privacy-policy/privacy-policy';
import { AccountSettingsPage } from '../../pages/account-settings/account-settings';
import { LoginPage } from '../../pages/login/login';


/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  id: string = "";
  user: any;
  fullName: string = "";
  username: string = "";
  email: string = "";
  editUsername: boolean = false;
  editEmail: boolean = false;
  emailReadOnly: boolean = true;
  fNReadOnly: boolean = true;
  uNReadOnly: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
            public authProvider: AuthProvider,
            public toastCtrl: ToastController, public alertCtrl: AlertController,
            public app: App) {

              //get the id from the profile page
    this.id = this.navParams.get('id');
    this.getUser();

  }

  ionViewDidLoad() {
  }

  //grab the current user information and initialize the variables
  getUser(){
    this.authProvider.getUser(this.id).subscribe((data) => {
      if(data.success){
        this.user = data.user;
        this.fullName = this.user.fullName;
        this.username = this.user.username;
        this.email = this.user.email;
      }
      else {
        //TODO err alert loading or something
        console.log(data.msg);
      }
    });
  }

  /*
  This function will push the EditPasswordPage when a user wants to edit their
  password. We send the user's id to the page for use.
  */
  pushEditPasswordPage(){
    this.navCtrl.push(EditPasswordPage, {id: this.id});
  }
  pushPrivacyPolicyPage(){
    this.navCtrl.push(PrivacyPolicyPage);
  }
  pushAccountSettingsPage(){
    this.navCtrl.push(AccountSettingsPage, {id: this.id});
  }

  /*
  toggleReadOnly function takes in a string and boolean. The string variable is
  used to toggle the proper boolean variable that controls the readonly input
  attribute. The boolean is to toggle the user's keyboard for UX.
  */

  toggleReadOnly(type: string, edit: boolean){
    console.log(type);
    console.log(edit);
    if(!edit){
      if(!this.fNReadOnly) return;
      if(!this.uNReadOnly) return;
      if(!this.emailReadOnly) return;
    }
    if(type =="fullName") this.fNReadOnly = !this.fNReadOnly;
    if(type =="username") this.uNReadOnly = !this.uNReadOnly;
    if(type == "email") this.emailReadOnly = !this.emailReadOnly;
  }

  /*
  Same function from the register page. Just checking that an email is correct.
  */
  confirmEmail(){
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(this.email.toLowerCase())){
      let alert = this.alertCtrl.create({
        title: 'Invalid Email',
        subTitle: "Please use a valid email",
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }
    return true;
  }
  /*
  Same function from the register page. Just checking that a username is correct.
  */
  confirmUsername(){
    let re = /^\w+$/;
    if(!re.test(this.username.toLowerCase())){
      let alert = this.alertCtrl.create({
        title: 'Invalid Username',
        subTitle: "Please use a username that only contains letters, numbers, or underscores",
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }
    return true;
  }

  /*
  saveChanges takes in a string parameter that is used to determine what the
  user is editing. Then a JSON object is created and sent to the auth provider
  to be sent to the server. Display a toast depending on the success/fail.
  */

  saveChanges(type: string){
    let editObj = {
      id: this.id,
      type: type
    };
    if(type =='fullName'){
      editObj['fullName'] = this.fullName;
    }
    if(type == 'username'){
      if(!this.confirmUsername()) return;
      editObj['username'] = this.username.toLowerCase();
    }
    if(type == 'email'){
      if(!this.confirmEmail()) return;
      editObj['email'] = this.email.toLowerCase();
    }
    this.authProvider.update(editObj).subscribe((data) => {
      if(data.success){
        this.toggleReadOnly('username', false);
        this.editUsername = false;
        this.toggleReadOnly('email', false);
        this.editEmail = false;
        this.toggleReadOnly('fullName', false);
        let msg = data.msg;
        let pos = "top";
        let cssClass = "success";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
      }
      else {

        let msg = data.msg;
        let pos = "top";
        let cssClass = "warning";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
      }
    });
  }

  /*
  Function to help create toasts easily
  */
  toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText){
    let toast = this.toastCtrl.create({
      message: msg,
      position: pos,
      cssClass: cssClass,
      showCloseButton: showCloseButton,
      closeButtonText: closeButtonText,
      dismissOnPageChange: true
    });
    toast.present().then(() => {
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    });
  }


  logout(){
    this.authProvider.logout();
    //this.events.publish('logout');
    this.app.getRootNavs()[0].push(LoginPage);
  }

}
