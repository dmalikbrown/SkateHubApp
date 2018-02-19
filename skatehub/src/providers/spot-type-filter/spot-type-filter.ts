import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable()
export class SpotTypeFilterProvider {

  filterItems: any =[]; //variable to hold filter items while app is running

  constructor() {
  }

  //set the filter items while the app is running
  setFilterItems(filterArray){
    this.filterItems = filterArray;
  }
  //return the filter items
  getFilterItems(){
    return this.filterItems;
  }


}
