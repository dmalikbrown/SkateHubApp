import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedSpotsPage } from './saved-spots';

@NgModule({
  declarations: [
    SavedSpotsPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedSpotsPage),
  ],
})
export class SavedSpotsPageModule {}
