import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {

  devEp: any = "http://192.168.1.5:3000";
  prodEp: any = "https://skatehub.herokuapp.com";

  constructor(public http: Http) {
  }

  sendMessage(messageObj, token){
      let headers = new Headers();
      headers.append('Authorization', token);
      headers.append('Content-Type','application/json');
      return this.http.post(this.devEp+"/skatehub/message",messageObj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }

  deleteMessage(messageObj, token){
    let headers = new Headers();
    headers.append('Authorization', token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.devEp+"/skatehub/delete/message",messageObj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  async getThread(threadId, token){
      let headers = new Headers();
      headers.append('Authorization', token);
      headers.append('Content-Type','application/json');
      return await this.http.get(this.devEp+"/skatehub/message/"+threadId,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
        .map(res => res.json());
  }


}
