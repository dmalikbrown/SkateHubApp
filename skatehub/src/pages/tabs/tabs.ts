import { Component } from '@angular/core';
import { NavParams, ModalController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SearchPage } from '../search/search';
import { PostPage } from '../post/post';
import { NavigatePage } from '../navigate/navigate';
import { ProfilePage } from '../profile/profile';
import { NotificationPage } from '../notification/notification';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SearchPage;
  tab3Root = PostPage;
  tab4Root = NavigatePage;
  tab5Root = ProfilePage;
  tab6Root = NotificationPage;
  user: any;


  constructor(public authProvider: AuthProvider, public navParams: NavParams,
            public modalCtrl: ModalController, public events: Events) {
    if(this.navParams.get('user')){
      this.user = this.navParams.get('user');
    }
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

  openPostPage(){
    let modal = this.modalCtrl.create(PostPage);
    modal.onDidDismiss((data) => {
      if(data.success){
        //event
        this.events.publish("newPost:event", {data: data});
      }
      else {
        //do nothing
        this.events.publish("newPost:event", {data: data});
      }
    });
    modal.present();
  }
}
