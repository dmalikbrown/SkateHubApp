import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { MessagePage } from '../pages/message/message';
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
import { DetailedUserPage } from '../pages/detailed-user/detailed-user';
import { RecoverPage } from '../pages/recover/recover';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { AccountSettingsPage } from '../pages/account-settings/account-settings';
import { EditPasswordPage } from '../pages/edit-password/edit-password';
import { FilterPage } from '../pages/filter/filter';
import { ThreadPage } from '../pages/thread/thread';
import { SeshesPage } from '../pages/seshes/seshes';
import { AddFriendPage } from '../pages/add-friend/add-friend';
import { OtherUserSpotsPage } from '../pages/other-user-spots/other-user-spots';
import { AddSessionPage } from '../pages/add-session/add-session';
import { CommentsPage } from '../pages/comments/comments';
import { NotificationPage } from '../pages/notification/notification';
import { OtherFriendsPage } from '../pages/other-friends/other-friends';

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
import { OneSignal } from '@ionic-native/onesignal';
import { Crop } from '@ionic-native/crop';


import { ElasticDirective } from '../directives/elastic/elastic';
import { Ionic2RatingModule } from 'ionic2-rating';

import { MessageProvider } from '../providers/message/message';
import { InviteProvider } from '../providers/invite/invite';
import { CommentProvider } from '../providers/comment/comment';
import { ReportProvider } from '../providers/report/report';



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
    DetailedUserPage,
    SettingsPage,
    RecoverPage,
    EditPasswordPage,
    InboxPage,
    MessagePage,
    FilterPage,
    AddFriendPage,
    PrivacyPolicyPage,
    AccountSettingsPage,
    ThreadPage,
    SeshesPage,
    OtherUserSpotsPage,
    AddSessionPage,
    ElasticDirective,
    CommentsPage,
    NotificationPage,
    OtherFriendsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    Ionic2RatingModule,
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
    DetailedUserPage,
    SettingsPage,
    RecoverPage,
    EditPasswordPage,
    InboxPage,
    AddFriendPage,
    PrivacyPolicyPage,
    AccountSettingsPage,
    MessagePage,
    FilterPage,
    SeshesPage,
    ThreadPage,
    OtherUserSpotsPage,
    AddSessionPage,
    CommentsPage,
    NotificationPage,
    OtherFriendsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    ImagePicker,
    FileTransfer,
    File,
    Camera,
    FilePath,
    Geolocation,
    NativeGeocoder,
    LaunchNavigator,
    Crop,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    SpotsProvider,
    SpotTypeFilterProvider,
    MessageProvider,
    InviteProvider,
    CommentProvider,
    ReportProvider
  ]
})
export class AppModule {}
