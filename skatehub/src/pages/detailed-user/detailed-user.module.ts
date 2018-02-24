import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailedUserPage } from './detailed-user';

@NgModule({
  declarations: [
    DetailedUserPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailedUserPage),
  ],
})
export class DetailedUserPageModule {}
