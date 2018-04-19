const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://www.reddit.com/r/nbastreams/');

    // const TABLE_SELECTOR = '#siteTable > div:nth-child(odd)';
    const TABLE_SELECTOR = 'thing';
    const GAME_THREAD_SELECTOR = '#ID > div:nth-child(4) > div:nth-child(1) > p:nth-child(1) > span:nth-child(2)';
    const GAME_TREAD_LINK = '#ID > div:nth-child(4) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)'
    let id_list = await page.evaluate((sel) => {
        let len = document.getElementsByClassName(sel).length;
        let id_list = [];
        for (let i = 0; i < len; i++) {
            id_list.push(document.getElementsByClassName(sel)[i].getAttribute('id'));
        };
        return id_list;
    }, TABLE_SELECTOR);
    console.log('total topics#', id_list.length);
    let current_id = '';
    let myurl = '';
    for (let i = 0; i < id_list.length; i++) {
        let game_thread_s = GAME_THREAD_SELECTOR.replace('ID', id_list[i]);
        let game_thread_link_s = GAME_TREAD_LINK.replace('ID', id_list[i]);
        let is_game_thread = await page.evaluate((sel) => {
            let myobj = document.querySelector(sel);
            if (myobj) {
                if ("Game Thread" === myobj.getAttribute('title')) {
                    return true;
                }
            }
        }, game_thread_s);

        if (is_game_thread) {
            myurl = await page.evaluate((sel) => {
                let myobj = document.querySelector(sel);
                if (myobj) {
                    return myobj.getAttribute('href');
                }
            }, game_thread_link_s);
            console.log(myurl);
            current_id = id_list[i].replace('thing', '');
            console.log(current_id);
            break;
        }
    }

    if (myurl !== '') {
        console.log("going to ", myurl);
        await page.goto('https://www.reddit.com' + myurl);
        // await page.waitForNavigation();
        let URL_TABLE_SELECTOR = '#siteTable' + current_id + ' > div:nth-child(1) > div:nth-child(2) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2) > a';
        const streamer_links = await page.evaluate((sel) => {
            const urllist = document.querySelectorAll(sel);
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
        //we only care about the first link

    }
    // await page.waitForNavigation();
    browser.close();
}

run();