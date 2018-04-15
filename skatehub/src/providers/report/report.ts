import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthProvider } from './../../providers/auth/auth';
import 'rxjs/add/operator/map';
/*
  Generated class for the ReportProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReportProvider {

  devEp: any = "http://localhost:3000";
  prodEp: any = "https://skatehub.herokuapp.com";

  constructor(public http: Http, public authProvider: AuthProvider) {
  }
  addReport(obj){
    let headers = new Headers();
    headers.append('Authorization', this.authProvider.token);
    headers.append('Content-Type','application/json');
    return this.http.post(this.prodEp+"/skatehub/report",obj,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

  getReportById(id){
    let headers = new Headers();
    headers.append('Authorization', this.authProvider.token);
    headers.append('Content-Type','application/json');
    return this.http.get(this.prodEp+"/skatehub/report/"+id,{headers: headers}) //use this when dev return this.http.post(ep, patient,{headers: headers})
      .map(res => res.json());
  }

}
