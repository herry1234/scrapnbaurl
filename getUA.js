const puppeteer = require('puppeteer');
async function getPuppeteerChromeUA() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const ua = await page.evaluate('navigator.userAgent');
    await browser.close();
    console.log(ua);
    return ua;
}

getPuppeteerChromeUA();