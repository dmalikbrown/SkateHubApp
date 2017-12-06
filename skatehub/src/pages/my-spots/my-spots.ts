import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MySpotsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-spots',
  templateUrl: 'my-spots.html',
})
export class MySpotsPage {

  spots: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MySpotsPage');
  }
  ionViewDidEnter(){
    this.spots = this.navParams.get('spots');
    console.log(this.spots);
  }

}
