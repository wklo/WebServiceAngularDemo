import { WebServiceAngularDemoPage } from './app.po';

describe('web-service-angular-demo App', () => {
  let page: WebServiceAngularDemoPage;

  beforeEach(() => {
    page = new WebServiceAngularDemoPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
