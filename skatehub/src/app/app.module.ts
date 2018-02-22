import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { InboxPage } from '../pages/inbox/inbox';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SearchPage } from '../pages/search/search';
import { PostPage } from '../pages/post/post';
import { NavigatePage } from '../pages/navigate/navigate';
import { ProfilePage } from '../pages/profile/profile';
import { SplashPage } from '../pages/splash/splash';
import { InvitesPage } from '../pages/invites/invites';
import { FriendsPage } from '../pages/friends/friends';
import { MySpotsPage } from '../pages/my-spots/my-spots';
import { SavedSpotsPage } from '../pages/saved-spots/saved-spots';
import { SettingsPage } from '../pages/settings/settings';
import { DetailedSpotPage } from '../pages/detailed-spot/detailed-spot';
import { FilterPage } from '../pages/filter/filter';

import { AuthProvider } from '../providers/auth/auth';
import { SpotsProvider } from '../providers/spots/spots';
import { SpotTypeFilterProvider } from '../providers/spot-type-filter/spot-type-filter';

import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { LaunchNavigator } from '@ionic-native/launch-navigator';



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    RegisterPage,
    SearchPage,
    PostPage,
    NavigatePage,
    ProfilePage,
    SplashPage,
    InvitesPage,
    FriendsPage,
    MySpotsPage,
    SavedSpotsPage,
    DetailedSpotPage,
    InboxPage,
    SettingsPage,
    FilterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    RegisterPage,
    SearchPage,
    PostPage,
    NavigatePage,
    ProfilePage,
    SplashPage,
    InvitesPage,
    FriendsPage,
    MySpotsPage,
    SavedSpotsPage,
    DetailedSpotPage,
    InboxPage,
    SettingsPage,
    FilterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ImagePicker,
    FileTransfer,
    File,
    Camera,
    FilePath,
    Geolocation,
    NativeGeocoder,
    LaunchNavigator,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    SpotsProvider,
    SpotTypeFilterProvider
  ]
})
export class AppModule {}
