import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';




/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  fullName: String = "";
  email: String = "";
  username: String = "";
  password: String = "";
  confirmPass: String = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
registerForm() {

  if(this.fullName == "" || this.email == "" || this.username == "" || this.password =="" || this.confirmPass == ""){
    let alert = this.alertCtrl.create({
      title: 'Invalid Form',
      subTitle: 'Please fill out all fields',
      buttons: ["Dismiss"]
    });
    alert.present();

    return;

  }
  let obj = {
    fullName: this.fullName  ,
    email: this.email ,
    username: this.username,
    password:  this.password
  };
  this.authProvider.registerUser(obj).subscribe(function(data){
    if(data.success){
      console.log(data.msg);
    }
    else{
      //print error or something
    }
  });
}
}
