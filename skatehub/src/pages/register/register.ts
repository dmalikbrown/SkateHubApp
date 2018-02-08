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
  }

  /*
  Confirms that the email the user types in contains attributes to be considered
  an email. If it is not a valid email, display alert.
  @parameters    none
  @return        boolean     If false, not valid. True, valid email.
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
  Confirms that the username the user types in contains attributes to be considered
  an username. If it is not a valid username, display alert.
  @parameters    none
  @return        boolean     If false, not valid. True, valid username.
  */
  confirmUsername(){
    let re = /^\w+$/;
    if(!re.test(this.username.toLowerCase()) || this.username.length >= 15){
      let alert = this.alertCtrl.create({
        title: 'Invalid Username',
        subTitle: "Please use a username that only contains letters, numbers,\
        or underscores and is also less than 15 characters",
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }
    return true;
  }
  /*
  Confirms that the password the user types in contains attributes to be considered
  a password. If it is not a valid password, display alert.
  @parameters    none
  @return        boolean     If false, not valid. True, valid password.
  */
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
  /*
  Confirms that the 'confirm password' the user types in matches their typed
  password. If it is not the same, display alert.
  @parameters    none
  @return        boolean     If false, not valid. True, valid match.
  */
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
  /*
  Pops the register page back to the login page.
  @parameters    none
  @return        none
  */
  goBack() {
    this.navCtrl.pop();
  }
  /*
  Makes a server call with the user's information to register. Double checks
  certain attributes for certain characters. If all attributes are valid, send
  the server the information. If user registers successfully, set TabsPage to root.
  @parameters    none
  @return        nothing
  */
registerForm() {

  /*
  Performs necessary checks
  */
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
  //server call
  this.authProvider.registerUser(obj).subscribe((data)=>{
    if(data.success){ //valid register set root to TabsPage with params
      console.log(data.token);
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
