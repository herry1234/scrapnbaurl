const puppeteer = require('puppeteer');
async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--user-agent=Mozilla/5.0 (Unknown; Linux) AppleWebKit/538.1 (KHTML, like Gecko) Chrome/v1.0.0 Safari/538.1']
    });
    const page = await browser.newPage();
    // await page.setJavaScriptEnabled(false);
    // await page.setRequestInterception(true);
    // page.on("request", async (request) => {
    //     console.log("on request",request.url());
    //   await request.continue();
    // });
    // page.on("response", async (response) => {
    //     // console.log('on response', response.url());
    //     if ( response.url().startsWith("https://mdskip.taobao.com") ) {
    //       console.log(await response.text());
    //     }
    //   });
    const test_url = 'https://detail.tmall.com/item.htm?id=523957302031';
    await page.goto(test_url);
    await page.waitFor(5 * 1000);
    await page.click('#J_TabBar > li:nth-child(2) > a');
    await page.waitFor(5 * 1000);

    const URL_TABLE_SELECTOR = '.rate-grid > table:nth-child(1) > tbody > tr > td > div:nth-child(1)'
    const comments = await page.evaluate((sel) => {
        const urllist = document.querySelectorAll(sel);
        console.log(urllist);
        const urls = [...urllist];
        return urls.map(link => link.innerText);
    }, URL_TABLE_SELECTOR);
    console.log(comments);
    browser.close();
}
run();