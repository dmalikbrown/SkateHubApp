import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { RegisterPage } from '../../pages/register/register';
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


  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider) {
  this.tabBarElement = document.querySelector('.tabbar');
  }
  ionViewDidLoad() {

  setTimeout(() => {
    this.splash = false;
  }, 4000);
    console.log('ionViewDidLoad LoginPage');
  }

  loginForm(){
    let obj = {
      username: this.username,
      password: this.password
    };
    this.authProvider.authenticateUser(obj).subscribe(function(data){
      if(data.success){
        console.log(data.msg);
      }
      else{
        //print error or something
      }
    });
  }

}
