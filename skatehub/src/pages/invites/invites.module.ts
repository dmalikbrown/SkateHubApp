import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvitesPage } from './invites';

@NgModule({
  declarations: [
    InvitesPage,
  ],
  imports: [
    IonicPageModule.forChild(InvitesPage),
  ],
})
export class InvitesPageModule {}
