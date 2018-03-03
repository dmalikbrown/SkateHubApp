import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeshesPage } from './seshes';

@NgModule({
  declarations: [
    SeshesPage,
  ],
  imports: [
    IonicPageModule.forChild(SeshesPage),
  ],
})
export class SeshesPageModule {}
