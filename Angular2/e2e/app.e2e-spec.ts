import { SurtyMaxPage } from './app.po';

describe('SurtyMax App', function() {
  let page: SurtyMaxPage;

  beforeEach(() => {
    page = new SurtyMaxPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
