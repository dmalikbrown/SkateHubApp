/*
Necessary imports. Be careful, some imports need to be initialized in the
constructor.
*/

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthProvider } from './../../providers/auth/auth';
import 'rxjs/add/operator/map';

/*
  Generated class for the SpotsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SpotsProvider {

  devEp: any = "http://localhost:3000";
  prodEp: any = "https://skatehub.herokuapp.com";

  constructor(public http: Http, public authProvider: AuthProvider) {
  }

  /*
  Makes a http call to the /skatehub/image/remove route that will remove an image from
  the cloudinary account. Takes a parameter "obj" which looks like:
  obj = {
  url: url -> String
}
  "url" contains the full url to the image's cloudinary url
  */
  removeImageCloud(obj){
    let headers = new Headers();
    headers.append('Authorization', this.authProvider.token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.prodEp+"/skatehub/image/remove",obj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  createSpot(obj){
    let headers = new Headers();
    headers.append('Authorization', this.authProvider.token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.prodEp+"/skatehub/spot/create",obj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }
  getAllSpots(){
    let headers = new Headers();
    headers.append('Authorization', this.authProvider.token);
    headers.append('Content-Type','application/json');
    return this.http.get(this.prodEp+"/skatehub/spots/all",{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

}
