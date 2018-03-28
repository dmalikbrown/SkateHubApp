import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the ThreadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-thread',
  templateUrl: 'thread.html',
})
export class ThreadPage {
  @ViewChild(Content) content: Content;

  recipients: any = [];
  id: string = "";
  message: string = "";
  thread: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public messageProvider: MessageProvider, public authProvider: AuthProvider) {
    this.recipients = this.navParams.get('recipients');
    this.id = this.navParams.get('id');
    this.thread = this.navParams.get('thread');
    if(!this.recipients){
      this.recipients = [];
      this.recipients.push({
        username: this.thread.recUsername
      });
    }
  }

  ionViewDidLoad() {
    this.scrollToBottom();
  }
  scrollToBottom(){
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 1000);
  }
  getThread(){
    if(!this.thread) return;
    this.messageProvider.getThread(this.thread.id, this.authProvider.token)
        .then((someObs) => {
          someObs.subscribe((data) => {
            if(data.success){
              // console.log(data);
              this.thread.thread.messages = data.thread.messages;
            }
            else {
               console.log(data.msg);
            }
          });
        });
  }
  // resetTextAreaHeight(){
  //   document.getElementsById('messageTextArea')
  // }

  sendMessage(){

    //TODO attach an id obj if there's already a thread made
    let msgArr = [];
    let threadId = '';
    let recipient = "";
    if(this.thread){
      console.log(this.thread);
      threadId = this.thread.id;
      if(this.thread.thread.receiver == this.id){
        recipient = this.thread.thread.sender;
      }
      else {
        recipient = this.thread.thread.receiver;
      }

    }
    else {
      recipient = this.recipients[0]._id;
    }
    let messageObj = {
      sender: this.id,
      receiver: recipient,
      message: this.message
    };

    msgArr.push(messageObj);
    console.log(msgArr);
    let newMsgObj = {
      threadId: threadId,
      sender: this.id,
      receiver: recipient,
      messages: msgArr
    };
    this.authProvider.loadToken();
    this.messageProvider.sendMessage(newMsgObj, this.authProvider.token).subscribe((data)=>{
      if(data.success){
        this.getThread();
        // this.resetTextAreaHeight();
        this.message = "";
        this.scrollToBottom();
      }
      else {
        console.log(data.msg);
      }
    });

  }

}
