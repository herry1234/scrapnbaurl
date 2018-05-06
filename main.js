const puppeteer = require('puppeteer');
const buffstreamzStreamer = require('./getBuffstreamz');
async function run() {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://www.reddit.com/r/nbastreams/');

    // const TABLE_SELECTOR = '#siteTable > div:nth-child(odd)';
    const TABLE_SELECTOR = 'thing';
    const GAME_THREAD_SELECTOR = '#ID > div:nth-child(4) > div:nth-child(1) > p:nth-child(1) > span:nth-child(2)';
    const GAME_THREAD_LINK = '#ID > div:nth-child(4) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)'
    let id_list = await page.evaluate((sel) => {
        let len = document.getElementsByClassName(sel).length;
        let id_list = [];
        for (let i = 0; i < len; i++) {
            id_list.push(document.getElementsByClassName(sel)[i].getAttribute('id'));
        };
        return id_list;
    }, TABLE_SELECTOR);
    console.log('total topics#', id_list.length);
    let id_link_list = [];
    for (let i = 0; i < id_list.length; i++) {
        let game_thread_s = GAME_THREAD_SELECTOR.replace('ID', id_list[i]);
        let game_thread_link_s = GAME_THREAD_LINK.replace('ID', id_list[i]);
        let is_game_thread = await page.evaluate((sel) => {
            let myobj = document.querySelector(sel);
            if (myobj) {
                if ("Game Thread" === myobj.getAttribute('title')) {
                // if ("Info Thread" === myobj.getAttribute('title')) {
                    return true;
                }
            }
        }, game_thread_s);

        if (is_game_thread) {
            const myurl = await page.evaluate((sel) => {
                let myobj = document.querySelector(sel);
                if (myobj) {
                    return myobj.getAttribute('href');
                }
            }, game_thread_link_s);
            console.log(myurl);
            const current_id = id_list[i].replace('thing', '');
            console.log(current_id);
            id_link_list.push({ id: current_id, url: myurl });
        }
    }

    let results = id_link_list.map(async (item) => {
        console.log("going to ", item.url);
        await page.goto('https://www.reddit.com' + item.url);
        // await page.waitForNavigation();
        // let URL_TABLE_SELECTOR = '#siteTable' + item.id + ' > div:nth-child(1) > div:nth-child(2) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2) > a';
        let URL_TABLE_SELECTOR = 'table>tbody>tr>td>a';
        const streamer_links = await page.evaluate((sel) => {
            const urllist = document.querySelectorAll(sel);
            const urls = [...urllist];
            return urls.map(link => link.href);
        }, URL_TABLE_SELECTOR);
        console.log("links", streamer_links);
        streamer_links.forEach(element => {
            if(element.match('buffstreamz') != null) {
                buffstreamzStreamer.getStream(element.replace('watch','embed'));
            }
            
        });
        // if (streamer_links[0]) {
        //     const embed_player_url = streamer_links[0].replace('watch', 'embed');
        //     console.log('going to player ', embed_player_url);
        //     await page.goto(embed_player_url);
        //     await page.evaluate((sel) => {
        //         const script_string = document.querySelector(sel);
        //         console.log(script_string);
        //     }, 'body > script:nth-child(3)');
        // }
    });
    Promise.all(results).then((completed) => console.log("DONE"));
    // await page.waitForNavigation();
    // browser.close();
}
run();