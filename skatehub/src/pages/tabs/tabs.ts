import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SearchPage } from '../search/search';
import { PostPage } from '../post/post';
import { NavigatePage } from '../navigate/navigate';
import { ProfilePage } from '../profile/profile';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SearchPage;
  tab3Root = PostPage;
  tab4Root = NavigatePage;
  tab5Root = ProfilePage;



  constructor() {

  }
}
