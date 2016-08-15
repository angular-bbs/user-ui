import { UserUiPage } from './app.po';

describe('user-ui App', function() {
  let page: UserUiPage;

  beforeEach(() => {
    page = new UserUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
