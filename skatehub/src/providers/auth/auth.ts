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

  prodEp: any = "";
  devEp: any = "http://10.30.168.136:3000";
  token: any;
  user: any;

  constructor(public http: Http, public storage: Storage) {
  //  console.log('Hello AuthProvider Provider');
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

}
