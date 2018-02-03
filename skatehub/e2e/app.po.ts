import { browser } from 'protractor'; //protractor is located in the test-config directory

export class Page {

  //use a browser instance to go to a particular url
  navigateTo(destination) {
    return browser.get(destination);
  }

  //return the title of the page
  getTitle() {
    return browser.getTitle();
  }


}
