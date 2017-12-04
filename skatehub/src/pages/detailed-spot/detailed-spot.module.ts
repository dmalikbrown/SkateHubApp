import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailedSpotPage } from './detailed-spot';

@NgModule({
  declarations: [
    DetailedSpotPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailedSpotPage),
  ],
})
export class DetailedSpotPageModule {}
