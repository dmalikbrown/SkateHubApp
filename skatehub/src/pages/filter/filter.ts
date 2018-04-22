import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import {SpotTypeFilterProvider} from '../../providers/spot-type-filter/spot-type-filter';
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
  rail: boolean;
  ledge: boolean;
  banks: boolean;
  diy: boolean;
  misc: boolean;
  ramp: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public event: Events, public spotTfp: SpotTypeFilterProvider) {
                this.getFilterArray();
  }

  ionViewDidLoad() {
  }
  /*
  Using the type string and checked boolean, dictate whether or not we are adding
  a type to the filterArr or removing a type from the filterArr.
  @parameters    string, boolean
  @return        nothing
  */
  addToFilterArray(type, checked){
    if(!checked){
      //if the checked is false, then we are unchecking

      //find the index of the type
      let index = this.filterArr.findIndex(spotType => spotType == type);
      //if the type isn't there, return
      if(index < -1) return;
      //remove the type
      this.filterArr.splice(index, 1);
    }
    else {
      //add to filter array
      this.filterArr.push(type);
    }
    //save the filter items
    this.spotTfp.setFilterItems(this.filterArr);

    //publish event so function in home.ts can run.
    this.event.publish('filter:event', this.filterArr);
  }
  /*
  Calls 'getFilterItems' function from spot-type-filter provider. This will return
  the most up to date filter list. If the list is empty, then the user isn't filtering.
  If the list contains some items, then the user has filtered and we should keep that
  filter until they remove it. If the filterArr contains any of the filters, set the
  checkbox variable to true.
  @parameters    none
  @return        nothing
  */
  getFilterArray(){
    this.filterArr = this.spotTfp.getFilterItems();
    if(this.filterArr.includes('stairs')) this.stairs = true;
    if(this.filterArr.includes('rail')) this.rail = true;
    if(this.filterArr.includes('ramp')) this.ramp = true;
    if(this.filterArr.includes('ledge')) this.ledge = true;
    if(this.filterArr.includes('banks')) this.banks = true;
    if(this.filterArr.includes('diy')) this.diy = true;
    if(this.filterArr.includes('misc')) this.misc = true;
  }

}
