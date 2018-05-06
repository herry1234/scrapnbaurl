const Chromeless = require('chromeless').default
async function run() {
    const chromeless = new Chromeless({
        remote: true,
    })
    // const chromeless = new Chromeless()
    chromeless
        .setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/538.1 (KHTML, like Gecko) Chrome/65.0.3325 Safari/538.1')
    const screenshot = await chromeless
        .goto('https://www.reddit.com/r/nbastreams/')
        .screenshot()
    const TABLE_SELECTOR = 'thing';
    const GAME_THREAD_SELECTOR = '#ID > div:nth-child(4) > div:nth-child(1) > p:nth-child(1) > span:nth-child(2)';
    const GAME_THREAD_LINK = '#ID > div:nth-child(4) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)'
    let id_list = await chromeless.evaluate((sel) => {
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
        let is_game_thread = await chromeless.evaluate((sel) => {
            let myobj = document.querySelector(sel);
            if (myobj) {
                // if ("Game Thread" === myobj.getAttribute('title')) {
                if ("Info Thread" === myobj.getAttribute('title')) {
                    return true;
                }
            }
        }, game_thread_s);

        if (is_game_thread) {
            const myurl = await chromeless.evaluate((sel) => {
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
    console.log(screenshot)
    await chromeless.end()
}

run().catch(console.error.bind(console))