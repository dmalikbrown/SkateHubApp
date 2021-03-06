import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  devEp: any = "http://localhost:3000";
  prodEp: any = "https://skatehub.herokuapp.com";
  token: any;
  user: any;
  appId: string = '3cc2428a-8bb2-4de9-befb-fa4d34429ffb';

  constructor(public http: Http, public storage: Storage) {
  //  console.log('Hello AuthProvider Provider');
  }

  getUser(id){
      let headers = new Headers();
      headers.append('Authorization', this.token);
      headers.append('Content-Type','application/json');
      return this.http.get(this.prodEp+"/skatehub/"+id,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }
  getNotifications(id){
      let headers = new Headers();
      headers.append('Authorization', this.token);
      headers.append('Content-Type','application/json');
      return this.http.get(this.prodEp+"/skatehub/notifications/"+id,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }
  getUserByQuery(key, value){
    let headers = new Headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type','application/json');
    return this.http.get(this.prodEp+"/skatehub/query/"+key+"/"+value,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }
  getAllUsers(){
    let headers = new Headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type','application/json');
    return this.http.get(this.prodEp+"/skatehub/all",{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }
  addInvites(invite){
    let headers = new Headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.prodEp+"/skatehub/add/invites",invite,{headers: headers})
      .map(res => res.json());
  }
  removeImageCloud(obj){
    let headers = new Headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.prodEp+"/skatehub/image/remove",obj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }
  update(edits){
      let headers = new Headers();
      headers.append('Authorization', this.token);
      headers.append('Content-Type','application/json');
      return this.http.post(this.prodEp+"/skatehub/update",edits,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }
  removeAccount(userObj){
      let headers = new Headers();
      headers.append('Authorization', this.token);
      headers.append('Content-Type','application/json');
      return this.http.post(this.prodEp+"/skatehub/delete",userObj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.prodEp+"/skatehub/authenticate",user,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.prodEp+"/skatehub/register",user,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }
  friendRequest(friend){
      let headers = new Headers();
      headers.append('Authorization', this.token);
      headers.append('Content-Type','application/json');
      return this.http.post(this.prodEp+"/skatehub/friend",friend,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }

  getOneSignalDevices(){
    // "Authorization: Basic NGEwMGZmMjItY2NkNy0xMWUzLTk5ZDUtMDAwYzI5NDBlNjJj" \
    //  "https://onesignal.com/api/v1/players?app_id={appId}&limit=300&offset=0"
    let headers = new Headers();
    headers.append('Authorization', "Basic NjY4NTA1MzItZjI5OC00NDE2LTk5NGItNGFhNmJmM2M0OWU5");
    headers.append('Content-Type','application/json');
    return this.http.get("https://onesignal.com/api/v1/players?app_id="+this.appId+"&offset=0",{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());

  }

  checkCurrentPassword(passwordObj){
    let headers = new Headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.prodEp+"/skatehub/comp_pass",passwordObj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  isValidToken(){
    return new Promise((resolve, reject) => {

        //Load token if exists
        this.storage.get('id_token').then((value) => {

            this.token = value;
            let headers = new Headers();
            headers.append('Authorization', this.token);
            this.http.get(this.prodEp+'/skatehub/protected', {headers: headers})
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    console.log(err);
                    reject(err);
                });

        });

    });

  }

  storeUserData(token, user){
    let key = 'id_token';
    this.storage.set(key, token);
    this.storage.set('userInfo', JSON.stringify(user));
    this.token = token;
    this.user = user;
  }
  loadUser(){
    this.storage.get('userInfo').then(user => {
      this.user = JSON.parse(user);
    });
  }

  updateUser(user){
    this.storage.set('userInfo', JSON.stringify(user));
    this.user = user;
  }

  loadToken(){
    this.storage.get('id_token').then(token => {
      this.token = token;
    });
  }
  logout(){
    this.token = null;
    this.user = null;
    this.storage.clear();
  }

}
