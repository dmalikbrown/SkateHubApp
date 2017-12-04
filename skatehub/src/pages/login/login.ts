import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RegisterPage } from '../../pages/register/register';

import { AuthProvider } from './../../providers/auth/auth';

import { TabsPage } from '../../pages/tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  registerPage = RegisterPage;
  tabsPage = TabsPage;
  username: any ="";
  password: any ="";


  splash = true;
  tabBarElement: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
          public authProvider: AuthProvider, public alertCtrl: AlertController) {
  this.tabBarElement = document.querySelector('.tabbar');
  }
  ionViewDidLoad() {
  }

  /*
  Makes a server call with the user's username and password to be authenticated.
  If the user is authenticated, set the TabsPage to the root.
  @parameters    none
  @return        nothing
  */
  loginForm(){
    let obj = {
      username: this.username,
      password: this.password
    };
    this.authProvider.authenticateUser(obj).subscribe((data) =>{
      if(data.success){//user was authenticated
        this.authProvider.storeUserData(data.token, data.user);
        this.navCtrl.setRoot(TabsPage, {user: data.user});
      }
      else{
        //print error or something
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
