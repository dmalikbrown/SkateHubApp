import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SplashPage } from '../pages/splash/splash';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthProvider } from './../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              modalCtrl: ModalController, public authProvider: AuthProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      let splash = modalCtrl.create(SplashPage, {duration: 1});
      splash.onDidDismiss(() =>{
        this.checkToken();
      });
      splash.present();

    });
  }
  checkToken(){
    this.authProvider.isValidToken().then((res) => {
         console.log("Already authorized");
         this.authProvider.loadUser();
        this.rootPage = TabsPage;
     }, (err) => {
         console.log("Not already authorized");
         this.rootPage = LoginPage;
     });
  }
}
