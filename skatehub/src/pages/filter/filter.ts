import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {

  filterArr: any = [];
  stairs: boolean;
  rails: boolean;
  ledges: boolean;
  banks: boolean;
  diy: boolean;
  misc: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public event: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
  }
  addToFilterArray(type, checked){
    if(!checked){
      let index = this.filterArr.findIndex(spotType => spotType == type);
      if(index < -1) return;
      this.filterArr.splice(index, 1);
    }
    else {
      this.filterArr.push(type);
    }
    this.event.publish('filter:event', this.filterArr);
  }

}
