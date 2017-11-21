import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';

/**
 * Generated class for the NavigatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-navigate',
  templateUrl: 'navigate.html',
})
export class NavigatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NavigatePage');
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

}
