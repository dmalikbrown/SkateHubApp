/*
Necessary imports. Be careful, some imports need to be initialized in the
constructor.
*/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,
  ActionSheetController, Platform, ToastController} from 'ionic-angular';
import {Headers} from '@angular/http';
import { AuthProvider } from './../../providers/auth/auth';
import { SpotsProvider } from './../../providers/spots/spots';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult} from '@ionic-native/native-geocoder';
// import { TabsPage } from './../../pages/tabs/tabs';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  user: any;
  imagePath: any; //typically going to be a string
  imageNewPath: any; //typically going to be a string
  spotDescription: any = "";//typically going to be a string
  spotName: any = "";
  currentLocationBoolean: boolean = false; //boolean if user wants to set spot addy to their location
  riskLvl: any;
  lighting: any;
  lat: any;
  lng: any;
  address: any = ""; //typically going to be a string
  resultArr: any = []; //typically going to be an array of strings
  skateTypes: any = []; //typically going to be an array of strings
  devEp = "http://localhost:3000"; //end point for the server when in dev mode
  prodEp = "https://skatehub.herokuapp.com";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthProvider, public spotsProvider: SpotsProvider,
              public imagePicker: ImagePicker, public file: File,
              public transfer: FileTransfer, public alertCtrl: AlertController,
              public actionSheet: ActionSheetController, public platform: Platform,
              public toastCtrl: ToastController, public camera: Camera,
              public filePath: FilePath, public geolocation: Geolocation,
              public nativeGeocoder: NativeGeocoder) {
  }

  ionViewDidLoad() {
  }
  ionViewDidEnter(){
    //console.log(this.authProvider.user);
    if(this.authProvider.user){
      this.user = this.authProvider.user;
    }
    else{
      this.user = this.navParams.data;
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

  /*
  Opens the camera on the device. Calls the "uploadPhoto()" function that will upload the photo.
  "imgUrl" is the file URI. Use this with string manipulation to grab information
  to copy file to application cache.
  */
  openCamera(){
    /*
    set camera options that are used after the picture is taken
    */
    let options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      // allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1080,
      targetHeight: 1080,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    //Open the camera on the device then capture the imgUrl (image url)
    this.camera.getPicture(options).then((imgUrl) => {

      /*
      String manipulation to attain source directory and source file name.
      Append the current date concatenated with some string manipulation to
      get a new file name that we're going to copy to use for upload.
      */
      let sourceDirectory = imgUrl.substring(0, imgUrl.lastIndexOf('/') + 1);

      let sourceFileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length);

      let newName = Date.now().toString()+sourceFileName.split('?').shift();

      /*
      Copy the file from the source directory with the source file name to the application's
      cache with the new file name.
      */
      this.file.copyFile(sourceDirectory, sourceFileName, cordova.file.cacheDirectory, newName).then((result: any) => {
        /*
        Set the image path to imgUrl.
        Set the new image path to "result.nativeURL" <- this is the new url to the copied image.
        */
        this.imagePath = imgUrl;
        this.imageNewPath = result.nativeURL;
        this.uploadPhoto(); //call the upload photo that uploads to cloudinary.

      }, (err) => {
        //If there's an error with file copying
        console.log("file copy "+ err);
        let alert = this.alertCtrl.create({
          title: 'Error Uploading',
          subTitle: "Try Again",
          buttons: ['Dismiss']
        });
        alert.present();
      });

    }, (err) => {
      //if there's an error with the camera ... is also thrown if the user doesn't
      //select an image hence just printing it out instead of an alert or something.
      console.log("get picture "+ err);
    });
  }

  /*
  Opens the photo library on the device. Allows a max of 4 images to be selected.
  Runs a loop that calls the "uploadPhoto()" function that will upload the photo at
  the current index in the loop. "results" is an array of the file URI's. Use those
  with string manipulation to grab information to copy file to application cache.
  */
  openPhotoLibrary(){
    /*
    set photo library options that are used after the pictures are selected
    */
    let options = {
      maximumImagesCount: 4, //This doesn't get applied on iOS -- bug with plugin
      height: 1080,
      width: 1080
    };
    this.imagePicker.getPictures(options).then((results) => {

        //TODO create loader and present

        let len = results.length;
        //check image length is less than 4.. plugin isn't checking
        if((len+this.resultArr.length) > 4){
          let alert = this.alertCtrl.create({
            title: 'Too many photos selected',
            subTitle: "Max: 4 pictures",
            buttons: ['Dismiss']
          });
          alert.present();
          return;
        }
        for (let i = 0; i < len; i++) {
          // console.log('Image URI: ' + results[i]); <-- prints the image urls

          /*
          If the device is android you have to resolve the native path of the urls
          if selected from photo library.
          */
          if(this.platform.is('android')){
              this.filePath.resolveNativePath(results[i])
                .then(filePath => {
                  //Same sequence from the "openCamera()" function
                  console.log("file path: "+ filePath);
                  console.log("results: "+ results[i]);
                  let sourceDirectory = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                  // results[i].lastIndexOf('?')
                  let sourceFileName = results[i].substring(results[i].lastIndexOf('/') + 1, results[i].length);
                  let newName = Date.now()+sourceFileName.split('?').shift();
                  console.log("src dir: "+ sourceDirectory);
                  console.log("src file: "+ sourceFileName);
                  console.log("new file: "+ newName);
                  this.file.copyFile(sourceDirectory, sourceFileName,cordova.file.cacheDirectory, newName).then((result: any) => {
                    this.imagePath = filePath;
                    this.imageNewPath = result.nativeURL;
                    this.uploadPhoto();
                  },(err) => {
                    console.log(JSON.stringify(err));
                    let alert = this.alertCtrl.create({
                      title: 'Error Uploading',
                      subTitle: "Try Again",
                      buttons: ['Dismiss']
                    });
                    alert.present();
                    return;
                  });
            });
          }
          else{
            //Device isn't Android

            //Same sequence from the "openCamera()" function
            let sourceDirectory = results[i].substring(0, results[i].lastIndexOf('/') + 1);

            let sourceFileName = results[i].substring(results[i].lastIndexOf('/') + 1, results[i].length);

            let newName = Date.now().toString()+sourceFileName.split('?').shift();

            this.file.copyFile(sourceDirectory, sourceFileName, cordova.file.cacheDirectory, newName).then((result: any) => {

              this.imagePath = results[i];
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
        }
        //TODO end the loading screen
      }, (err) => { });
  }
  /*
  Sends an image to the server to be uploaded to cloudinary account.
  Takes no parameters but uses the "imagePath" and "imageNewPath" class variables.
  */
  uploadPhoto() {

      //grab the file name with string manipulation
      let filename = this.imagePath.split('/').pop();

      //Append the token to the Authorization header for transmission to server
      let headers = new Headers();
      headers.append('Authorization',this.authProvider.token);

      //Options for the file transfer plugin
      let options: FileUploadOptions = {
        headers: headers,
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "image/jpeg"
        //params: {} <-- if we had some added parameters
      };


      const fileTransfer: FileTransferObject = this.transfer.create();

      //send the file to the routes in the router.js file
      fileTransfer.upload(this.imageNewPath, encodeURI(this.prodEp+'/skatehub/image/upload'),
        options).then((entry) => {
          //entry is returned from the server.
          console.log(entry);

          /*
          "entry" will contain the url from cloudinary linked to a specific image. We
          need that url to display the images selected. TYPICALLY, you don't have to
          send to the server first but for some reason the images don't want to display.
          Since there can be mulitple images, add the url to the "resultArr" array.
          */
          this.resultArr.push(JSON.parse(entry.response).fileUrl.url);
        }, (err) => {
          //TODO if error alert message or something
          console.log(err);
        });

  }
  /*
  Opens an action sheet from bottom of screen. Takes 2 parameters: url from
  image and the index of that url.
  The action sheet contains 2 buttons: Remove and Cancel. If "Remove" is clicked,
  then the url is removed from the "resultArr" array.
  */
  openDeleteAction(url, index){
    let actionSheet = this.actionSheet.create({
      title: '',
      buttons: [
        {
          text: 'Remove',
          icon: !this.platform.is('ios') ? 'trash' : null, //tertiary operator to display icons or not
          handler: () => {
            //if remove is clicked run this code

            //remove the url from "resultArr" based on the index of the url
            this.resultArr.splice(index, 1);
            //Creates obj that contains the url to remove from cloudinary account
            let obj = {
              url: url
            };
            //make server call to routes.js in routes folder
            this.spotsProvider.removeImageCloud(obj).subscribe((data) =>{
              if(data.success){//if removing url was success
                let toast = this.toastCtrl.create({
                  message: 'Image removed!',
                  position: 'bottom',
                  cssClass:'link',
                  showCloseButton: true,
                  closeButtonText: 'Ok',
                  duration: 3000
                });
                toast.present();
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
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
        }
      ]
    });
    actionSheet.present(); //display the action sheet
  }

  grabAddress(){
    if(this.address != ""){
      this.address = "";
    }
    this.geolocation.getCurrentPosition().then((resp) => {
       // resp.coords.latitude
       // resp.coords.longitude
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
       this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
          .then((result: NativeGeocoderReverseResult) =>{
            console.log(JSON.stringify(result));
            this.address = result.subThoroughfare+" "+result.thoroughfare +", "+ result.locality + ", "+ result.administrativeArea;
          })
          .catch((error: any) => console.log(error));

      }).catch((error) => {
        console.log('Error getting location', error);
      });

  }

  checkInputs(){
    if(this.resultArr.length == 0){
      let alert = this.alertCtrl.create({
        title: 'No images for the spot',
        subTitle: "Select or take a photo for your spot!",
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }
    if(this.skateTypes.length == 0){
      let alert = this.alertCtrl.create({
        title: 'No type selected for the spot',
        subTitle: "Select a type for your spot!",
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }
    //TODO check for address
    return true;
  }

  uploadSpot(){
    if(!this.checkInputs()){
      return;
    }
    else{
      if(this.address != '' && (!this.lng || !this.lat)){
        this.nativeGeocoder.forwardGeocode(this.address)
                      .then((coords: NativeGeocoderForwardResult) => {
                        console.log(coords);
                        this.lat = Number(coords.latitude);
                        this.lng = Number(coords.longitude);
                        this.sendSpot();
                      })
                      .catch((err)=> {
                        //TODO Do something to grab addy
                        //Ask user to use current location???
                        console.log(err);
                      })
      }
      else if(this.address != '' && this.lng && this.lat){
        this.sendSpot();
      }
      else {
        console.log("you have an error");
      }
      // console.log("ready to post!");

    }
  }
  clear(){
    this.spotName = "";
    this.address = "";
    this.skateTypes = [];
    this.spotDescription = "";
    this.resultArr = [];
    this.lighting = "";
    this.riskLvl = 0;
    this.lat = 0;
    this.lng = 0;
  }
  sendSpot(){
      let obj = {
        id: this.user._id,
        name: this.spotName,
        location: this.address,
        types: this.skateTypes,
        description: this.spotDescription,
        images: this.resultArr,
        lightingLvl: this.lighting,
        riskLvl: this.riskLvl,
        coordinates: {
          lat: this.lat,
          lng: this.lng
        }
      };
      //TODO make server call with needed attributes
      console.log(obj);

    this.spotsProvider.createSpot(obj).subscribe((data) => {
      if(data.success){
        let toast = this.toastCtrl.create({
          message: "You've added a spot",
          position: 'top',
          cssClass:'link',
          duration: 3000
        });
        toast.present();
        this.clear();
        this.navCtrl.parent.select(0);
      }
      else{
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: data.msg,
          buttons: ["Dismiss"]
        });
        alert.present();
      }
    });
  }

}
