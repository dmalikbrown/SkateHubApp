import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {} from 'jasmine';
import { DebugElement } from '@angular/core';
import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { IonicModule, Platform } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock } from '../../test-config/mocks-ionic';
import { LoginPage } from '../pages/login/login';


describe('Root Component', () => {

  let de: DebugElement;
  let comp: MyApp;
  let fixture: ComponentFixture<MyApp>;

  //setting up the modules and imports with the providers and necessary modules
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MyApp],
      imports: [
        IonicModule.forRoot(MyApp),
        HttpModule,
        IonicStorageModule.forRoot()
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthProvider, useClass: AuthProvider }
      ]
    });

  }));

  //Creating the individual environment for the test
  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    comp = fixture.componentInstance;
  });



  //Actual test ... does the app load
  it('should create component', () => {

    expect(comp instanceof MyApp).toBe(true);

  });

  // it('displays the login page to the user', () => {
  //       comp.checkToken();
  //       fixture.detectChanges();
  //       expect(comp['rootPage']).toBe(LoginPage);
  //   });

});
