import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherFriendsPage } from './other-friends';

@NgModule({
  declarations: [
    OtherFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(OtherFriendsPage),
  ],
})
export class OtherFriendsPageModule {}
