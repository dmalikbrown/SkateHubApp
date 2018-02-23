import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,
AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the EditPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-password',
  templateUrl: 'edit-password.html',
})
export class EditPasswordPage {

  currPassword: string = "";
  id: string = "";
  matchNewPassword: string = "";
  newPassword: string = "";
  correct: boolean = false;
  newPassMatch: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider, public toastCtrl: ToastController,
              public alertCtrl: AlertController) {
                //grab id from settings page to use.
                this.id = this.navParams.get('id');
  }

  ionViewDidLoad() {
  }

  //Password validation, same as in the register page.
  validatePassword(){
    if(this.newPassword.length < 6){
      let alert = this.alertCtrl.create({
        title: 'Password Length',
        subTitle: 'Password must be at least 6 characters',
        buttons: ["Dismiss"]
      });
      alert.present();
      return false;
    }
    return true;
  }
  /*
  Make sure the user types in their new password correctly twice.
  */
  compareNewPassword(){
    if(this.newPassword == this.matchNewPassword){
      this.newPassMatch = false;
    }
    else {
      this.newPassMatch = true;
    }
  }
  /*
  Make sure the user is typing in their old password properly. Everytime the
  user types, make a server call that will continuously check that the input
  is correct or not. When the input becomes correct, toggle the 'correct' var
  to true.
  */
  checkCurrentPassword(){
    let passwordObj = {
      id: this.id,
      password: this.currPassword
    };
    this.authProvider.checkCurrentPassword(passwordObj).subscribe((data) => {
      if(data.success){
        this.correct = true;
      }
      else {
        this.correct = false;
      }
    });
  }

/*
Make a server call to the update route indicating the user wants to edit their
password. Show a toast depending on success/fail, if success, pop the page back
to the settings page.
*/
  savePassword(){
    if(!this.validatePassword()) return;
    let editObj = {
      id: this.id,
      type: "password",
      newPassword: this.newPassword
    };
    this.authProvider.update(editObj).subscribe((data) => {
      if(data.success){

        let msg = data.msg;
        let pos = "top";
        let cssClass = "success";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
        this.navCtrl.pop();
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
  Make creating toast easier
  */
  toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText){
    let toast = this.toastCtrl.create({
      message: msg,
      position: pos,
      cssClass: cssClass,
      showCloseButton: showCloseButton,
      closeButtonText: closeButtonText
    });
    toast.present().then(() => {
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    });
  }

}
