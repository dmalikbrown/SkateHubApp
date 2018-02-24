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

  constructor(public http: Http, public storage: Storage) {
  //  console.log('Hello AuthProvider Provider');
  }

  getUser(id){
      let headers = new Headers();
      headers.append('Authorization', this.token);
      headers.append('Content-Type','application/json');
      return this.http.get(this.devEp+"/skatehub/"+id,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }
  getAllUsers(){
    let headers = new Headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type','application/json');
    return this.http.get(this.devEp+"/skatehub/all",{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }
  update(edits){
      let headers = new Headers();
      headers.append('Authorization', this.token);
      headers.append('Content-Type','application/json');
      return this.http.post(this.devEp+"/skatehub/update",edits,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.devEp+"/skatehub/authenticate",user,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(this.devEp+"/skatehub/register",user,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  checkCurrentPassword(passwordObj){
    let headers = new Headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.devEp+"/skatehub/comp_pass",passwordObj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  isValidToken(){
    return new Promise((resolve, reject) => {

        //Load token if exists
        this.storage.get('id_token').then((value) => {

            this.token = value;
            let headers = new Headers();
            headers.append('Authorization', this.token);
            this.http.get(this.devEp+'/skatehub/protected', {headers: headers})
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
