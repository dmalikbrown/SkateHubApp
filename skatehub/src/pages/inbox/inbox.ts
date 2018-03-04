import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { MessagePage } from '../../pages/message/message';
import { ThreadPage } from '../../pages/thread/thread';
import { MessageProvider } from '../../providers/message/message'
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the InboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

  id: any = "";
  threads: any = [];
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public messageProvider: MessageProvider, public authProvider: AuthProvider,
              public alertCtrl: AlertController) {

  }

  ionViewDidEnter() {
    this.id = this.navParams.get('id');
    this.getUser();
  }
  openMessage(){
      this.navCtrl.push(MessagePage);
  }
  openMessage(){
      this.navCtrl.push(MessagePage);
  }

  getUser(){
    this.authProvider.getUser(this.id).subscribe((data) => {
      if(data.success){
        this.user = data.user;
        // console.log(this.user);
        this.getThreads();
      }
      else {
        //TODO err alert loading or something
        console.log(data.msg);
      }
    });
  }

  getThreads(){
    let len = 0;
    if(this.user.messages){
      len = this.user.messages.length;
    }
    for(let i = 0; i<len; i++){
      this.messageProvider.getThread(this.user.messages[i].id, this.authProvider.token)
        .then((someObs)=>{
            someObs.subscribe((data) => {
              if(data.success){
                let recId = "";
                //Gotta flip the sender and receiver depending on who started the thread
                //probably a better way to do this lol
                if(data.thread.receiver == this.id) {
                  recId = data.thread.sender;
                }
                else {
                  recId = data.thread.receiver;
                }
                this.authProvider.getUser(recId)
                  .subscribe((recData) =>{
                    // console.log(recData);
                    if(recData.success){
                      let thumbnailMsg = "";
                      if(data.thread.messages[data.thread.messages.length-1].sender == this.id){
                        thumbnailMsg = "You: "+data.thread.messages[data.thread.messages.length-1].message;
                      }
                      else {
                        thumbnailMsg = data.thread.messages[data.thread.messages.length-1].message;
                      }
                      let messageThumb = {
                        id: data.thread._id,
                        recAvatar: recData.user.avatar,
                        recUsername: recData.user.username,
                        thumbnailMsg: thumbnailMsg,
                        thread: data.thread
                      };
                      this.threads.push(messageThumb);
                      // console.log(this.threads[0]);
                    }
                    else {
                      console.log(recData.msg);
                    }
                  });
              }
              else {
                console.log(data.msg);
              }
            });


  getUser(){
    this.authProvider.getUser(this.id).subscribe((data) => {
      if(data.success){
        this.user = data.user;
        // console.log(this.user);
        this.getThreads();
      }
      else {
        //TODO err alert loading or something
        console.log(data.msg);
      }
    });
  }

  getThreads(){
    let len = 0;
    if(this.user.messages){
      len = this.user.messages.length;
    }
    for(let i = 0; i<len; i++){
      this.messageProvider.getThread(this.user.messages[i].id, this.authProvider.token)
        .then((someObs)=>{
            someObs.subscribe((data) => {

              if(data.success){
                let recId = "";
                //Gotta flip the sender and receiver depending on who started the thread
                //probably a better way to do this lol
                if(!data.thread) return;
                if(data.thread.receiver == this.id) {
                  recId = data.thread.sender;
                }
                else {
                  recId = data.thread.receiver;
                }
                this.authProvider.getUser(recId)
                  .subscribe((recData) =>{
                    // console.log(recData);
                    if(recData.success){
                      let thumbnailMsg = "";
                      if(data.thread.messages[data.thread.messages.length-1].sender == this.id){
                        thumbnailMsg = "You: "+data.thread.messages[data.thread.messages.length-1].message;
                      }
                      else {
                        thumbnailMsg = data.thread.messages[data.thread.messages.length-1].message;
                      }
                      let messageThumb = {
                        id: data.thread._id,
                        recAvatar: recData.user.avatar,
                        recUsername: recData.user.username,
                        thumbnailMsg: thumbnailMsg,
                        thread: data.thread
                      };
                      let index = this.threads.findIndex((x) => x.id == messageThumb.id);
                      if(index < 0){
                        this.threads.push(messageThumb);
                      }

                      // console.log(this.threads[0]);
                    }
                    else {
                      console.log(recData.msg);
                    }
                  });
              }
              else {
                console.log(data.msg);
              }
            });
      });
    }
  }
  pushDetailThread(thread){
    this.navCtrl.push(ThreadPage, {thread: thread, id: this.id});
  }
  deleteThread(thread){
    let messageObj = {
      _id: thread.thread._id
    };
    let alert = this.alertCtrl.create({
    title: 'Are you sure?',
    message: 'This conversation history will be deleted from your inbox',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Delete',
        handler: () => {
          let index = this.threads.findIndex((x) => x.thread._id == thread.thread._id);
          console.log(thread);
          console.log(index);
          if(index > -1){
            this.threads.splice(index,1);
          }
          this.messageProvider.deleteMessage(messageObj, this.authProvider.token)
              .subscribe((data) => {
                  if(data.success){
                    this.getThreads();
                  }
                  else {
                    let errorAlert = this.alertCtrl.create({
                      title: 'Error deleting',
                      subTitle: data.msg,
                      buttons: ['Dismiss']
                    });
                    errorAlert.present();
                  }
              });
        }
      }
    ]
  });
    alert.present();

  }
  // dismiss(){
  //   this.viewCtrl.dismiss();
  // }

}
