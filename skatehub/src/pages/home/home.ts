import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;


  user: any;

  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
            public navParams: NavParams) {
  }

  ionViewCanEnter(){
    this.authProvider.isValidToken().then((res) => {
         console.log("Already authorized");
        return true;
     }, (err) => {
         console.log("Not already authorized");
         return false;
     });
  }
  ionViewDidEnter(){
    //console.log(this.authProvider.user);
    if(this.authProvider.user){
      this.user = this.authProvider.user;
      console.log(this.user);
    }
    else{
      this.user = this.navParams.data;
      console.log(this.user);
    }
  }

  scrollToTop() {
    this.content.scrollToTop();
  }
}
