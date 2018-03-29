import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SplashPage } from '../pages/splash/splash';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthProvider } from './../providers/auth/auth';
import { OneSignal } from '@ionic-native/onesignal';


/*
One signal app id: 3cc2428a-8bb2-4de9-befb-fa4d34429ffb

*/

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  appId: string = '3cc2428a-8bb2-4de9-befb-fa4d34429ffb';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              modalCtrl: ModalController, public authProvider: AuthProvider,
              public oneSignal: OneSignal) {
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
      this.setUpNotifications();
    });
  }
  setUpNotifications(){
    this.oneSignal.startInit(this.appId);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
        // do something when notification is received
        console.log("NOTIFICATION HAS GOTTEN TO ME!!!!");
    });
    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      // do something when a notification is opened
      console.log("NOTIFICATION WAS OPENED!!!");
      console.log(data);
    });
    this.oneSignal.endInit();
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
