import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { TabsPage } from '../../pages/tabs/tabs';



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

  fullName: string = "";
  email: string = "";
  username: string = "";
  password: string = "";
  confirmPass: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

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
  confirmPassword(){
    if(this.password.length < 6){
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
  passwordMatch(){
    if(this.password != this.confirmPass){
      let alert = this.alertCtrl.create({
        title: "Error",
        subTitle: 'Passwords must match',
        buttons: ["Dismiss"]
      });
      alert.present();
      return false;
    }
    return true;
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
  if(!this.confirmEmail()){
    return;
  }
  if(!this.confirmUsername()){
    return;
  }
  if(!this.confirmPassword()){
    return;
  }
  if(!this.passwordMatch()){
    return;
  }

  let obj = {
    fullName: this.fullName,
    email: this.email.toLowerCase() ,
    username: this.username.toLowerCase(),
    password:  this.password
  };
  this.authProvider.registerUser(obj).subscribe((data)=>{
    if(data.success){
      console.log(data);
      this.authProvider.storeUserData(data.token, data.user);
      this.navCtrl.setRoot(TabsPage, {user: data.user});
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: data.msg,
        buttons: ["Dismiss"]
      });
      alert.present();
    }
  });
}

}
