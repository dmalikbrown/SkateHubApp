import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InviteProvider {

  devEp: any = "http://localhost:3000";
  prodEp: any = "https://skatehub.herokuapp.com";

  constructor(public http: Http) {
  }

  sendInvite(inviteObj, token){
      let headers = new Headers();
      headers.append('Authorization', token);
      headers.append('Content-Type','application/json');
      return this.http.post(this.devEp+"/skatehub/create/invite",inviteObj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }
  acceptInvite(inviteObj, token){
    let headers = new Headers();
    headers.append('Authorization', token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.devEp+"/skatehub/accept/invite",inviteObj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  declineInvite(inviteObj, token){
    let headers = new Headers();
    headers.append('Authorization', token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.devEp+"/skatehub/decline/invite",inviteObj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }
  deleteInvite(inviteObj, token){
    let headers = new Headers();
    headers.append('Authorization', token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.devEp+"/skatehub/delete/invite",inviteObj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  getAllInvites(token){
    let headers = new Headers();
    headers.append('Authorization', token);
    headers.append('Content-Type','application/json');
    return this.http.get(this.devEp+"/skatehub/invites/all",{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  async getInvite(inviteId, token){
      let headers = new Headers();
      headers.append('Authorization', token);
      headers.append('Content-Type','application/json');
      return await this.http.get(this.devEp+"/skatehub/invite/"+inviteId,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }


}
