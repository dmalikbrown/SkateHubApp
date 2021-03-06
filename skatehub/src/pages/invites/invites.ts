import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import { AddSessionPage } from '../../pages/add-session/add-session';
import { SeshesPage } from '../../pages/seshes/seshes';
import { InviteProvider } from '../../providers/invite/invite';
import { AuthProvider } from '../../providers/auth/auth';
import { SpotsProvider } from '../../providers/spots/spots';


@IonicPage()
@Component({
  selector: 'page-invites',
  templateUrl: 'invites.html',
})
export class InvitesPage {

  inviteIds: any = [];
  requested: any = [];
  accepted: any = [];
  emptyRequests: boolean = true;
  emptyInvites: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public inviteProvider: InviteProvider,
              public authProvider: AuthProvider,
              public spotsProvider: SpotsProvider,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
  }
  /**
  * This is a lifecyle call by ionic that retrieve invites
  * @param none
  * @return {bool} none
  */
  ionViewDidLoad() {
    this.inviteIds = this.navParams.get('invites');
    this.loadInviteInfo();
  }
  /**
* This is a lifecyle call by ionic that accepts invites
* @method acceptInvite
* @param {String} index
* @param {Object} invite
* @return none
*/
  acceptInvite(invite, index){
    let user = this.navParams.get('user');
    let obj = {
      userId: {
        id: user._id
      },
      inviteId: invite._id
    };
    this.inviteProvider.acceptInvite(obj, this.authProvider.token).subscribe((data)=>{
      if(data.success){
        this.requested.splice(index, 1);
        if(this.requested.length == 0 ){
          this.emptyRequests == true;
        }
        this.loadInviteInfo();
      }
      else {
        console.log(data.msg);
      }
    });
  }
  declineInvite(invite, index){
    let user = this.navParams.get('user');
    let obj = {
      userId: {
        id: user._id
      },
      inviteId: invite._id
    };
    this.inviteProvider.declineInvite(obj, this.authProvider.token).subscribe((data)=>{
      if(data.success){
        this.requested.splice(index, 1);
        if(this.requested.length == 0 ){
          this.emptyRequests == true;
        }
        this.loadInviteInfo();
      }
      else {
        console.log(data.msg);
      }
    });
  }
  openSessionModal(){
    if(this.navParams.get('spots').length == 0
    && this.navParams.get('savedSpots').length == 0)
    {
      //TODO alert or something
      let alert = this.alertCtrl.create({
        title: 'No spots',
        subTitle: "Create or save a spot to create a session",
        buttons: ['Dismiss']
      });
      alert.present();
      return false;
    }

    let modal = this.modalCtrl.create(AddSessionPage, {
      user: this.navParams.get('user'),
      spots: this.navParams.get('spots'),
      savedSpots: this.navParams.get('savedSpots')
    });
    modal.onDidDismiss((data) => {
      if(data.success){
        let idObj = {
          id: data.invite._id
        }
        this.inviteIds.push(idObj);
        this.accepted = [];
        this.requested = [];
        this.loadInviteInfo();
      }
      else if(data.error) {
        //TODO error
      }
      else {
        //do nothing
      }
    });
    modal.present();
  }

  pushSeshesPage(sesh, hasJoined){
    this.navCtrl.push(SeshesPage, {user: this.navParams.get('user'), session: sesh, hasJoined: hasJoined});

  }

  checkDecline(invite){
    let index = invite.declined.findIndex(user => user.id == this.navParams.get('user')._id);
    if(index > -1){
      return true;
    }
    return false;
  }
  checkAccepted(invite){
    let index = invite.accepted.findIndex(user => user.id == this.navParams.get('user')._id);
    if(index > -1){
      return true;
    }
    return false;
  }

  loadInviteInfo(){
    let len = this.inviteIds.length;
    for(let i = 0; i<len; i++){
      this.inviteProvider.getInvite(this.inviteIds[i].id, this.authProvider.token)
        .then((someObs)=>{
            someObs.subscribe((data) => {

              if(data.success){
                let invite = data.invite;
                if(!invite) return;
                // console.log(invite);
                if(this.checkDecline(invite)) return;
                this.authProvider.getUser(data.invite.sender).subscribe((userData)=>{
                  if(userData.success){
                    invite.sender = userData.user;
                    this.spotsProvider.getSpotById(data.invite.spot).subscribe((spotData)=>{
                      if(spotData.success){
                        invite.spot = spotData.spot;
                        // console.log(userData);
                        if(this.checkAccepted(invite) && invite.active
                          || this.navParams.get('user')._id == userData.user._id){
                          this.emptyInvites = false;
                          this.accepted.push(invite);
                        }
                        else {
                          if(invite.active){
                            this.emptyRequests = false;

                            this.requested.push(invite);
                          }
                        }
                      }
                      else {
                        //TODO error
                      }
                    });
                  }
                  else {
                    //TODO error
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

}
