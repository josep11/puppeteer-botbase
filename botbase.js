/*global __dirname, process */
const helper = require('./src/helper');
const puppeteer = require('puppeteer');

class BotBase {
    browser = null;
    page = null;

    async initialize() {
        var pjson = require('./package.json');
        console.log(`init bot base v${pjson.version}`);
        if (this.browser != null) {
            this.browser.close();
            this.page = null;
        }
        this.browser = await puppeteer.launch({

        });
        this.page = await this.browser.newPage();
    }

    async isLoggedIn() {
        // console.log(`page = ${this.page}`);
    }

    async logIP() {
        await this.page.goto('http://checkip.amazonaws.com/');
        let current_ip_address = await this.page.evaluate(() => document.body.textContent.trim());
        await helper.writeIPToFile(current_ip_address, helper.dateFormatForLog());
        console.log(current_ip_address);
        return current_ip_address
    }


    async _testSampleWebsite () {
        this.browser = await puppeteer.launch({
            // args: [...argsTor], //TODO: reactivar tor
            headless: false,
            devtools: false,
            ignoreHTTPSErrors: true,
            // slowMo: 50,
            // args: ['--disable-gpu', '--no-sandbox', '--no-zygote', '--disable-setuid-sandbox', '--disable-accelerated-2d-canvas', '--disable-dev-shm-usage', "--proxy-server='direct://'", "--proxy-bypass-list=*"]
        });
        this.page = await this.browser.newPage();

        await this.page.goto('https://bot.sannysoft.com', { waitUntil: 'networkidle2' });
    }
}

module.exports = BotBase;