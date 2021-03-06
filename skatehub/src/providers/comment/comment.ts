import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthProvider } from './../../providers/auth/auth';
import 'rxjs/add/operator/map';


/*
  Generated class for the CommentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommentProvider {

  devEp: any = "http://localhost:3000";
  prodEp: any = "https://skatehub.herokuapp.com";

  constructor(public http: Http, public authProvider: AuthProvider) {
  }

  addComment(obj){
    let headers = new Headers();
    headers.append('Authorization', this.authProvider.token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.prodEp+"/skatehub/comment",obj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  getCommentById(id){
    let headers = new Headers();
    headers.append('Authorization', this.authProvider.token);
    headers.append('Content-Type','application/json');
    return this.http.get(this.prodEp+"/skatehub/comment/"+id,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }
  getAllComments(spotId){
    let headers = new Headers();
    headers.append('Authorization', this.authProvider.token);
    headers.append('Content-Type','application/json');
		  return this.http.get(this.prodEp+"/skatehub/comments/spots/all/"+spotId, {headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }


}
