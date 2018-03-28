import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OtherUserSpotsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-other-user-spots',
  templateUrl: 'other-user-spots.html',
})
export class OtherUserSpotsPage {

  spotsArr: any = [];
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.navParams.get('user');
    this.spotsArr = this.navParams.get('spots');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad OtherUserSpotsPage');
  }

}
