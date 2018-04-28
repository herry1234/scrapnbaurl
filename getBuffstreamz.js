const axios = require("axios");
const cheerio = require('cheerio');
async function getScript(bsUrl) {
    try {
        const response = await axios.get(bsUrl);
        // console.log(response.data);
        const $ = cheerio.load(response.data);
        let playerUrl = $('iframe').attr('src');
        if (playerUrl.startsWith('http') 　!= true) {
            playerUrl = 'http://' + playerUrl;
        }
        console.log(playerUrl);
        const playerResponse = await axios.get(playerUrl, {
            'headers': {
                'content-type': 'text/html; charset=UTF-8',
                'Accept-Encoding': 'gzip, deflate',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                'Referer': bsUrl
            }
        });
        const regex1 = RegExp('source:(.*)\,');
        let paringResult = null;
        if ((paringResult = regex1.exec(playerResponse.data)) != null) {
            console.log(paringResult[1]);
        }
    } catch (error) {
        console.error(error);
    }
}
exports.getStream = getScript;
// getScript('http://buffstreamz.com/embed/nba-5.php');