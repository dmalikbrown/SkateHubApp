import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SearchPage } from '../search/search';
import { PostPage } from '../post/post';
import { NavigatePage } from '../navigate/navigate';
import { ProfilePage } from '../profile/profile';
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
  user: any;


  constructor(public authProvider: AuthProvider, public navParams: NavParams) {
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
  // ionViewDidEnter(){
  //   if(this.navParams.get('user')){
  //     this.user = this.navParams.get('user');
  //   }
  //   else{
  //     this.authProvider.loadUser();
  //     this.user = this.authProvider.user;
  //   }
  // }
}
