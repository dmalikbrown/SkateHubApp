import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController,
  ToastController, ActionSheetController, Platform} from 'ionic-angular';
import {Headers} from '@angular/http';
import { FileTransfer, FileUploadOptions,
  FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from './../../providers/spots/spots';
import { InvitesPage } from './../../pages/invites/invites';
import { FriendsPage } from './../../pages/friends/friends';
import { MySpotsPage } from './../../pages/my-spots/my-spots';
import { SavedSpotsPage } from './../../pages/saved-spots/saved-spots';
import { SettingsPage } from './../../pages/settings/settings';
import { LoginPage } from './../../pages/login/login';
import * as moment from 'moment';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userId: any;
  user: any;
  spots: any = [];
  defaultAvatar: any = "assets/imgs/profileGeneric.jpg";
  imagePath: any;
  imageNewPath: any;
  imageChosen: any = 0;
  stance: any;
  categories: any = "posts";
  devEp: any = "http://localhost:3000";
  prodEp: any = "https://skatehub.herokuapp.com";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider, public app: App,
              public alertCtrl: AlertController, public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController, public file: File,
              public transfer: FileTransfer, public platform: Platform,
              public camera: Camera, public filePath: FilePath,
              public spotsProvider: SpotsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
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
    if(this.authProvider.user){
      this.userId = this.authProvider.user._id;
    }
    else{
      this.userId = this.navParams.data.id;
    }

    this.getUser(this.userId);
  }

  ionViewWillLeave(){

  }
  openSortAS(){
    let actionSheet = this.actionSheetCtrl.create({
       title: 'SORT POSTS BY',
       buttons: [
         {
           text: 'My Spots',
           handler: () => {
             // this.actionHandler(1);
           }
         },
         {
           text: 'Saved Spots',
           handler: () => {
             // this.actionHandler(2);
           }
         },
         {
           text: 'Cancel',
           role: 'cancel'
         }
       ]
     });

     actionSheet.present();
  }

  getUser(id){
    console.log(id);
    this.authProvider.getUser(id).subscribe((data)=>{
      //TODO with some user stuff
      if(data.success){
        this.user = data.user;
        this.authProvider.updateUser(this.user);
        this.loadInfo();
        // console.log(this.user);
        this.imagePath = this.user.avatar;
        if(this.checkAvatar() && this.checkStance()){
          let msg = "Update your profile picture and skate stance to enhance your profile!";
          let pos = "top";
          let cssClass = "warning";
          let showCloseButton = true;
          let closeButtonText = "Ok";
          this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
        }
        else if(this.checkAvatar()){
          let msg = "Update your profile picture to enhance your profile!";
          let pos = "top";
          let cssClass = "warning";
          let showCloseButton = true;
          let closeButtonText = "Ok";
          this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
        }
        else if(this.checkStance()){
          let msg = "Update your skate stance to enhance your profile!";
          let pos = "top";
          let cssClass = "warning";
          let showCloseButton = true;
          let closeButtonText = "Ok";
          this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
        }
      }
      else {
        //TODO Error alert
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: data.msg,
          buttons: ["Dismiss"]
        });
        alert.present();
        return false;
      }
    });
  }
  loadInfo(){
    this.spotsProvider.getSpotsByUserId(this.user._id).subscribe((data) => {
      if(data.success){
        this.spots = data.spots;
        console.log(data.msg);
      }
      else {
        console.log(data.msg);
      }
    });
  }
  checkAvatar(){
    if(this.user.avatar == this.defaultAvatar){
      return true;
    }
    return false;
  }

  checkStance(){
    if(this.user.stance == '' || !this.user.stance){
      return true;
    }
    return false;
  }
  toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText){
    let toast = this.toastCtrl.create({
      message: msg,
      position: pos,
      cssClass: cssClass,
      showCloseButton: showCloseButton,
      closeButtonText: closeButtonText,
      dismissOnPageChange: true
    });
    //Fixes the bug issue #62 .. gotta call dismiss function at some point
    toast.present().then(() => {
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    });
  }
  mySpotsPage(){
    console.log("My Spots");
    this.navCtrl.push(MySpotsPage, {spots: this.user.spots});
  }
  friendsPage(){
    console.log("Friends");
    this.navCtrl.push(FriendsPage, {user: this.user});
  }
  invitesPage(){
    console.log("Invites");
    this.navCtrl.push(InvitesPage,
      {
        user: this.user,
        invites: this.user.invites,
        spots: this.user.spots,
        savedSpots: this.user.savedSpots
      });
  }
  savedSpotsPage(){
    console.log("Saved Spots");
    this.navCtrl.push(SavedSpotsPage, {spots: this.user.savedSpots});
  }
  settingsPage(){
    console.log("Settings");
    this.navCtrl.push(SettingsPage, {id: this.userId});
  }
  logout(){
    this.authProvider.logout();
    //this.events.publish('logout');
    this.app.getRootNavs()[0].push(LoginPage);
  }

  /*
  *Checks to see if the current stance has an appropriate value
  *allows the user to simply tap the text to change it to ther preferred value
  *working on getting it to talk back to the server*
  */
  changeStance(){
    console.log("Stance Changed");

    if(this.user.stance == null)
    {

      this.user.stance = "Goofy";
      console.log("Goofy stance has been chosen.");
    }
    else if(this.user.stance == "Goofy")
    {
      this.user.stance = "Regular";
      console.log("Regular stance has been chosen.");
			// return;
    }
    else if(this.user.stance == "Regular")
    {
      this.user.stance = "Goofy";
      console.log("Last elif, Goofy stance has been chosen.");
      //  return;
    }
    let edits = {
            id: this.userId,
            type: "stance",
            stance: this.user.stance
    };

    this.authProvider.update(edits).subscribe((data)=>{
      if(data.success){
        console.log(this.user.stance, "data success");
        let msg = "Successfully changed stance!";
        let pos = "top";
        let cssClass = "success";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
      }
      else {
        console.log("data was not a success.");
        let msg = "Failed at changing stance!";
        let pos = "top";
        let cssClass = "warning";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
      }
    });
  }



  /*========= PROFILE EDIT IMAGE STUFF ============*/


  uploadPhoto() {

    let filename = this.imagePath.split('/').pop();

    //options for when the img gets uploaded
    let headers = new Headers();
    headers.append('Authorization',this.authProvider.token);

    var options = {
      headers: headers,
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpg",
      params: {
     'id': this.userId,
      } //send this added parameters to the route
    };


    const fileTransfer: FileTransferObject = this.transfer.create();

    //send the file to the routes in the router.js file
    fileTransfer.upload(this.imageNewPath, encodeURI(this.prodEp+'/skatehub/image/upload'),
      options).then((entry) => {
       this.imagePath = JSON.parse(entry.response).fileUrl.url;
        // this.imageChosen = 0;
        //this.navCtrl.setRoot(HomePage);

      }, (err) => {
        console.log("uploading");
        console.log(err);
        let alert = this.alertCtrl.create({
          title: 'Error Uploading',
          subTitle: "Try Again",
          buttons: ['Dismiss']
        });
        alert.present();

      });

  }

  editDbAvatar(){
    let edits = {
      id: this.userId,
      type: "avatar",
      avatar: this.imagePath
    };
    this.authProvider.update(edits).subscribe((data)=>{
      if(data.success){
        this.imageChosen = 0;
        let msg = data.msg;
        let pos = "top";
        let cssClass = "success";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
      }
      else {
        let msg = data.msg;
        let pos = "top";
        let cssClass = "warning";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
      }
    });
  }

  openEditAvatarAS(){
    let actionSheet = this.actionSheetCtrl.create({
       title: 'Edit your avatar',
       buttons: [
         {
           text: 'Use Photo Library',
           handler: () => {
             this.actionHandler(1);
           }
         },
         {
           text: 'Use Camera',
           handler: () => {
             this.actionHandler(2);
           }
         },
         {
           text: 'Cancel',
           role: 'cancel'
         }
       ]
     });

     actionSheet.present();
  }

  actionHandler(selection: any) {
    var options: any;
    //var camera = this.camera;
    if (selection == 1) {
      options = {
        quality: 75,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        saveToPhotoAlbum: false
      };
    } else {
      options = {
        quality: 75,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        saveToPhotoAlbum: false
      };
    }

    this.camera.getPicture(options).then((imgUrl) => {
      //console.log("Img URL: "+imgUrl);
        if (this.platform.is('android') && options.sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imgUrl)
            .then(filePath => {
              let sourceDirectory = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let sourceFileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.lastIndexOf('?'));
              let newName = moment()+sourceFileName.split('?').shift();
              this.file.copyFile(sourceDirectory, sourceFileName,cordova.file.cacheDirectory, newName).then((result: any) => {
                this.imagePath = filePath;
                this.imageChosen = 1;
                this.imageNewPath = result.nativeURL;
                this.uploadPhoto();
              },(err) => {
                console.log("file copy "+ err);
                let alert = this.alertCtrl.create({
                  title: 'Error Uploading',
                  subTitle: "Try Again",
                  buttons: ['Dismiss']
                });
                alert.present();
              });
        });
      }
      else{
        let sourceDirectory = imgUrl.substring(0, imgUrl.lastIndexOf('/') + 1);

        // var sourceFileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length);
        let sourceFileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length);

        //console.log("sourceD: "+sourceDirectory);

        let newName = moment()+sourceFileName.split('?').shift();

        this.file.copyFile(sourceDirectory, sourceFileName, cordova.file.cacheDirectory, newName).then((result: any) => {

          this.imagePath = imgUrl;
          // console.log(this.imagePath);
          this.imageChosen = 1;
          this.imageNewPath = result.nativeURL;
          this.uploadPhoto();

        }, (err) => {
          console.log("file copy "+ err);
          let alert = this.alertCtrl.create({
            title: 'Error Uploading',
            subTitle: "Try Again",
            buttons: ['Dismiss']
          });
          alert.present();
        });
      }
    }, (err) => {
      console.log("get picture "+ err);
      // let alert = this.alertCtrl.create({
      //   title: 'Error Uploading',
      //   subTitle: "Try Again",
      //   buttons: ['Dismiss']
      // });
      // alert.present();
    });
  }
  clear(){
    let obj = {
      url: this.imagePath
    };
    this.authProvider.removeImageCloud(obj).subscribe((data) =>{
      if(data.success){//if removing url was success
        this.imagePath = this.user.avatar;
        this.imageChosen = 0;
      }
      else{//if removing url threw error
        let alert = this.alertCtrl.create({
          title: 'Error Removing Image',
          subTitle: "Please try again",
          buttons: ['Dismiss']
        });
        alert.present();
      }
    });
  }

}
