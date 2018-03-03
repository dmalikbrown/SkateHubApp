import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../../pages/login/login';
/**
 * Generated class for the AccountSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-settings',
  templateUrl: 'account-settings.html',
})
export class AccountSettingsPage {

  id: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, public authProvider: AuthProvider,
              public app: App) {
    this.id = this.navParams.get('id');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AccountSettingsPage');
  }

  removeAccount(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: "Deleting your account removes all of your data.\nYou cannot recovery the account after this action.",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove Account',
          handler: () => {
            let obj = {
              id: this.id
            };
            this.authProvider.removeAccount(obj).subscribe((data)=> {
              if(data.success){
                this.authProvider.logout();
                //this.events.publish('logout');
                this.app.getRootNavs()[0].push(LoginPage);
              }
              else {
                 console.log(data.msg);
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

}
