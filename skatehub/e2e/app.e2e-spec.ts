import { Page } from './app.po';

describe('App', () => {
  let page: Page;

  //Initialize the page before the testing begins
  beforeEach(() => {
    page = new Page();
  });

  //we are testing the default screen -- the index.html file loads
  describe('default screen', () => {
    beforeEach(() => {
      //navigateTo is a function that is created in the app.po.ts file
      //it takes a 'destination' as a parameter
      page.navigateTo('/');
    });

    //test
    //the page instance calls a function that returns the title of the page
    it('should load the main app files first', () => {
      //getTitle is a function that is created in the app.po.ts file
      //it take no parameters but returns the title of a page
      page.getTitle().then(title => {
        //check the title
        expect(title).toEqual("Ionic App");
      });
    });
  });

})
