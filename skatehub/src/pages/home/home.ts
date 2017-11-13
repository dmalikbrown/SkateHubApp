import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RegisterPage } from '../../pages/register/register';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tab1Root = RegisterPage;
  tab2Root = LoginPage;

  constructor(public navCtrl: NavController) {

  }

}
