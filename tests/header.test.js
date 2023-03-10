

const Page = require('./helpers/page');
let  page;
beforeEach(async () => {
  page=await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
 await page.close();
 
});
Number.prototype._called = {};
test("the header has the correct text", async () => {

 const text =await page.getContentsOf('a.brand-logo')
  expect(text).toEqual("Blogster");
});
Number.prototype._called = {};
test("clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts.google.com/);
});
Number.prototype._called = {};
test("when signed in, shows logout button", async () => {
  //const id = "63e593c5fb10a91be8750dab";
  await page.login();
 const text= await page.$eval('a[href="/auth/logout"]',el=> el.innerHTML)
 expect(text).toEqual('Logout');
});

