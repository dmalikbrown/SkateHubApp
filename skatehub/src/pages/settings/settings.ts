import { Component } from '@angular/core';
import {Headers} from '@angular/http';

import { IonicPage, NavController, NavParams, ToastController, AlertController,
  App, Platform, ActionSheetController, ViewController} from 'ionic-angular';
import { FileTransfer, FileUploadOptions,
  FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { AuthProvider } from '../../providers/auth/auth';
import { EditPasswordPage } from '../../pages/edit-password/edit-password';
import { PrivacyPolicyPage } from '../../pages/privacy-policy/privacy-policy';
import { AccountSettingsPage } from '../../pages/account-settings/account-settings';
import { LoginPage } from '../../pages/login/login';
import * as moment from 'moment';


declare var cordova: any;

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  id: string = "";
  user: any;
  fullName: string = "";
  username: string = "";
  email: string = "";
  stance: string = "";
  diffUser: boolean = false;
  diffEmail: boolean = false;
  emailReadOnly: boolean = true;
  fNReadOnly: boolean = true;
  uNReadOnly: boolean = true;
  changeMade: boolean = false;

  headerImagePath: any = "";
  headerImageNewPath: any;
  headerImageChosen: any = 0;

  imagePath: any;
  imageNewPath: any;
  imageChosen: any = 0;
  devEp: any = "http://localhost:3000";
  prodEp: any = "https://skatehub.herokuapp.com";

  constructor(public navCtrl: NavController, public navParams: NavParams,
            public authProvider: AuthProvider,
            public toastCtrl: ToastController, public alertCtrl: AlertController,
            public app: App, public file: File,
            public transfer: FileTransfer, public platform: Platform,
            public camera: Camera, public filePath: FilePath,
            public actionSheetCtrl: ActionSheetController,
            public viewCtrl: ViewController, public crop: Crop) {

              //get the id from the profile page
    this.id = this.navParams.get('id');
    this.getUser();

  }

  ionViewDidLoad() {
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }

  //grab the current user information and initialize the variables
  getUser(){
    this.authProvider.getUser(this.id).subscribe((data) => {
      if(data.success){
        this.user = data.user;
        this.imagePath = this.user.avatar;
        this.fullName = this.user.fullName;
        this.username = this.user.username;
        this.email = this.user.email;
        this.stance = this.user.stance;
        this.headerImagePath = this.user.headerImage;
        console.log(this.headerImagePath);
      }
      else {
        //TODO err alert loading or something
        console.log(data.msg);
      }
    });
  }

  /*
  This function will push the EditPasswordPage when a user wants to edit their
  password. We send the user's id to the page for use.
  */
  pushEditPasswordPage(){
    this.navCtrl.push(EditPasswordPage, {id: this.id});
  }
  pushPrivacyPolicyPage(){
    this.navCtrl.push(PrivacyPolicyPage);
  }
  pushAccountSettingsPage(){
    this.navCtrl.push(AccountSettingsPage, {id: this.id});
  }
  toggleSaveBtn(){
    if(this.fullName != this.user.fullName || this.username != this.user.username ||
       this.email != this.user.email || this.stance != this.user.stance ||
        this.imagePath != this.user.avatar){
      this.changeMade = true;
    }
  }

  checkUsername(){
    if(this.username.toLowerCase() == this.user.username) return true;
    let re = /^\w+$/;
    if(!re.test(this.username.toLowerCase())){
      let alert = this.alertCtrl.create({
        title: 'Invalid Username',
        subTitle: "Please use a username that only contains letters, numbers, or underscores",
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }
    return true;
  }
  checkEmail(){
    if(this.email.toLowerCase() == this.user.email) return true;
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(this.email.toLowerCase())){
      let alert = this.alertCtrl.create({
        title: 'Invalid Email',
        subTitle: "Please use a valid email",
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }
    return true;
  }

  /*
  saveChanges takes in a string parameter that is used to determine what the
  user is editing. Then a JSON object is created and sent to the auth provider
  to be sent to the server. Display a toast depending on the success/fail.
  */

  checkChanges(){
    this.authProvider.getUserByQuery('username',this.username.toLowerCase()).subscribe((data)=>{
      console.log(data);
      if(data.success){
        if(data.user && this.username.toLowerCase() != this.user.username){
          let msg = 'That username is in use!';
          let pos = "top";
          let cssClass = "warning";
          let showCloseButton = true;
          let closeButtonText = "Ok";
          this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
          return;
          // bool = false;
        }
        else {
          console.log("no user");
          if(!this.checkUsername()) return;
          if(!this.checkEmail()) return;
          console.log("querying email");
          this.authProvider.getUserByQuery('email',this.email.toLowerCase()).subscribe((other)=>{
            if(other.success){
              if(other.user && this.email.toLowerCase() != this.user.email){
                let msg = 'That email is in use!';
                let pos = "top";
                let cssClass = "warning";
                let showCloseButton = true;
                let closeButtonText = "Ok";
                this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
                return;
              }
              else {
                    //TODO Add notification setttings
                    // if(this.headerImagePath != this.user.headerImage){
                    //   editObj['headerImage'] = this.headerImagePath;
                    // }
                let editObj = {
                  id: this.id,
                  fullName: this.fullName,
                  username: this.username.toLowerCase(),
                  email: this.email.toLowerCase(),
                  stance: this.stance,
                  type: 'profile-info',
                  avatar: this.imagePath,
                  headerImage: this.headerImagePath
                };
                this.save(editObj);
              }
            }
            else {
              let msg = data.msg;
              let pos = "top";
              let cssClass = "warning";
              let showCloseButton = true;
              let closeButtonText = "Ok";
              this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
              return false;
            }
          });

        }
      }
      else {
        let msg = data.msg;
        let pos = "top";
        let cssClass = "warning";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
        // return false;
      }
    });
  }
  save(editObj){
    this.authProvider.update(editObj).subscribe((data) => {
      if(data.success){
        let msg = data.msg;
        let pos = "top";
        let cssClass = "success";
        let showCloseButton = true;
        let closeButtonText = "Ok";
        this.toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText);
        this.dismiss();
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

  /*
  Function to help create toasts easily
  */
  toastCreator(msg, pos, cssClass, showCloseButton, closeButtonText){
    let toast = this.toastCtrl.create({
      message: msg,
      position: pos,
      cssClass: cssClass,
      showCloseButton: showCloseButton,
      closeButtonText: closeButtonText,
      dismissOnPageChange: true
    });
    toast.present().then(() => {
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    });
  }

  /*========= PROFILE EDIT IMAGE STUFF ============*/

  setBackground(){
    // console.log(this.headerImagePath);
    if(this.headerImagePath != "" && this.headerImagePath){
      console.log(this.headerImagePath);
      return {
           "background-color": "",
           "background-image": "url("+this.headerImagePath+")",
           "background-repeat": "no-repeat",
           "background-size": "100% 8em",
           "position": "absolute",
           "width": "100%",
           "height": "8em"
      }
    }
    else {
      // console.log("here");
      return {
           "background-color": '#9bbff2',
           "position": "absolute",
           "width": "100%",
           "height": "8em"
      }
    }
  }
  uploadHeader() {

    let filename = this.headerImagePath.split('/').pop();

    //options for when the img gets uploaded
    let headers = new Headers();
    console.log("AUTH TOKEN");
    console.log(this.authProvider.token);
    headers.append('Authorization',this.authProvider.token);

    let options: FileUploadOptions = {
      headers: headers,
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/png",
      params: {
     'id': this.user._id,
      } //send this added parameters to the route
    };


    const fileTransfer: FileTransferObject = this.transfer.create();

    //send the file to the routes in the router.js file
    fileTransfer.upload(this.headerImageNewPath, encodeURI(this.prodEp+'/skatehub/image/upload'),
      options).then((entry) => {
       this.headerImagePath = JSON.parse(entry.response).fileUrl.url;
       console.log(this.headerImagePath);
       this.changeMade = true;
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
  uploadPhoto() {

    let filename = this.imagePath.split('/').pop();

    //options for when the img gets uploaded
    let headers = new Headers();
    headers.append('Authorization',this.authProvider.token);

    let options: FileUploadOptions = {
      headers: headers,
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/png",
      params: {
     'id': this.user._id,
      } //send this added parameters to the route
    };


    const fileTransfer: FileTransferObject = this.transfer.create();

    //send the file to the routes in the router.js file
    fileTransfer.upload(this.imageNewPath, encodeURI(this.prodEp+'/skatehub/image/upload'),
      options).then((entry) => {
       this.imagePath = JSON.parse(entry.response).fileUrl.url;
       this.changeMade = true;
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
  openEditHeaderAS(){
    let actionSheet = this.actionSheetCtrl.create({
       title: 'Edit your header',
       buttons: [
         {
           text: 'Use Photo Library',
           handler: () => {
             this.headerActHandler(1);
           }
         },
         {
           text: 'Use Camera',
           handler: () => {
             this.headerActHandler(2);
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
  headerActHandler(selection: any) {
    let options: CameraOptions;
    //var camera = this.camera;
    if (selection == 1) {
      options = {
        quality: 75,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: this.camera.EncodingType.PNG,
        targetWidth: 600,
        targetHeight: 600,
        saveToPhotoAlbum: false
      };
    } else {
      options = {
        quality: 75,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: this.camera.EncodingType.PNG,
        targetWidth: 600,
        targetHeight: 600,
        saveToPhotoAlbum: false
      };
    }

    this.camera.getPicture(options).then((imgUrl) => {
      this.crop.crop(imgUrl, {quality: 75, targetHeight: 120, targetWidth: 400, heightRatio: 1, widthRatio: 4})
              .then(
                newImage => {
                  //console.log("Img URL: "+imgUrl);
                    if (this.platform.is('android') && options.sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                      this.filePath.resolveNativePath(newImage)
                        .then(filePath => {
                          let sourceDirectory = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                          let sourceFileName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
                          let newName = moment()+sourceFileName.split('?').shift();
                          this.file.copyFile(sourceDirectory, sourceFileName,cordova.file.cacheDirectory, newName).then((result: any) => {
                            this.headerImagePath = filePath;
                            this.headerImageChosen = 1;
                            this.headerImageNewPath = result.nativeURL;
                            this.uploadHeader();
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
                    let sourceDirectory = newImage.substring(0, newImage.lastIndexOf('/') + 1);

                    // var sourceFileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length);
                    let sourceFileName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.length);

                    //console.log("sourceD: "+sourceDirectory);

                    let newName = moment()+sourceFileName.split('?').shift();

                    this.file.copyFile(sourceDirectory, sourceFileName, cordova.file.cacheDirectory, newName).then((result: any) => {

                      this.headerImagePath = newImage;
                      // console.log(this.imagePath);
                      this.headerImageChosen = 1;
                      this.headerImageNewPath = result.nativeURL;
                      this.uploadHeader();

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
                },
                (error) => console.error('Error cropping image', error)
              );
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

  actionHandler(selection: any) {
    let options: CameraOptions;
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


  logout(){
    // console.log("LOGOUT?");
    this.authProvider.logout();
    //this.events.publish('logout');
    this.app.getRootNavs()[0].push(LoginPage);
    this.dismiss();
  }

}
