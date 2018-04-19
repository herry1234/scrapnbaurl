const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    const test_url = 'https://www.reddit.com/r/nbastreams/comments/8dalu7/game_thread_minnesota_timberwolves_houston/';
    const current_id = '_t3_8dalu7';
    console.log("going to ", test_url);
    await page.goto(test_url);
    // await page.waitForNavigation();
    let URL_TABLE_SELECTOR = '#siteTable' + current_id + ' > div:nth-child(1) > div:nth-child(3) > form > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2)> a';        
    // let URL_TABLE_SELECTOR = '#form-t1_dxlg351hhz > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > a'

    console.log(URL_TABLE_SELECTOR);
    const streamer_links = await page.evaluate((sel) => {
        const urllist = document.querySelectorAll(sel);
        console.log(urllist);
        const urls = [...urllist];
        return urls.map(link => link.href);
    }, URL_TABLE_SELECTOR);
    console.log("links", streamer_links);
    if (streamer_links[0]) {
        const embed_player_url = streamer_links[0].replace('watch', 'embed');
        console.log('going to player ', embed_player_url);
        await page.goto(embed_player_url);
        await page.evaluate((sel) => {
            const script_string = document.querySelector(sel);
            console.log(script_string);
        }, 'body > script:nth-child(3)');
    }
}
run();