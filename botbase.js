/*global __dirname, process */
const deepmerge = require('deepmerge');
const puppeteer = require('puppeteer');
const path = require('path');

const helper = require('./helper');

const HelperPuppeteer = require('./helper_puppeteer');
let config = require('./config/config.json');

class BotBase {
    browser = null;
    page = null;

    basePath = null;

    /**
     * 
     * @param {string} basePath the dirname basePath
     */
    constructor(basePath, configChild={}) {
        this.basePath = basePath;
        //merging config options prioritising upcoming ones
        config = deepmerge(config, configChild );

        this.cookiesFile = path.resolve(basePath, './res/cookies.json');
        this.screenshotBasepath = path.resolve(basePath, './screenshots');
    }

    async initialize(opts = {}) {
        var pjson = require('./package.json');
        console.log(`init bot base v${pjson.version}`);
        if (this.browser != null) {
            this.browser.close();
            this.page = null;
        }
        this.browser = await puppeteer.launch({
            ...opts
        });
        this.page = await this.browser.newPage();

        await this.semiRandomiseViewPort();
    }

    async semiRandomiseViewPort(){
        await this.page.setViewport({
            width: config.settings.width + helper.getRandBetween(1, 100),
            height: config.settings.height + helper.getRandBetween(1, 100)
        })
    }

    async isLoggedIn() {
        throw 'not implemented';
    }

    async logIP() {
        await this.page.goto('http://checkip.amazonaws.com/');
        let current_ip_address = await this.page.evaluate(() => document.body.textContent.trim());
        await helper.writeIPToFile(current_ip_address, helper.dateFormatForLog(), this.basePath);
        console.log(current_ip_address);
        return current_ip_address
    }

    async _testSampleWebsite() {
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

        await this.page.evaluate(HelperPuppeteer.scrollToBottom);
    }

    enabled(){
        return config.settings.enabled;
    }

    getConfig(){
        return config;
    }

    getVersion(){
        var pjson = require('./package.json');
        return pjson.version;
    }

    async shutDown() {
        this.browser.close();
    }
    
    appName(){
        return "SHOULD OVERRIDE ¯\_(ツ)_/¯ SHOULD OVERRIDE";
    }
    
}

module.exports = BotBase;