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
    mainUrl = null;

    /**
     * 
     * @param {string} basePath the dirname basePath where project is installed
     * @param {string} mainUrl used for checking isLoggedIn and loginWithSession
     * @param {*} configChild optional
     */
    constructor(mainUrl, basePath, configChild = {}) {
        if (!mainUrl || typeof mainUrl != "string" || !mainUrl.includes('http')) {
            throw new Error('Developer fix this: mainUrl is undefined or not string or not a valid url. \nCheck constructor types: https://github.com/josep11/puppeteer-botbase/blob/main/botbase.js');
        }

        if (!basePath) {
            throw new Error('Developer fix this: basePath is undefined');
        }
        
        this.basePath = basePath;
        this.mainUrl = mainUrl;
        //merging config options prioritising upcoming ones
        config = deepmerge(config, configChild);

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

    async semiRandomiseViewPort() {
        await this.page.setViewport({
            width: config.settings.width + helper.getRandBetween(1, 100),
            height: config.settings.height + helper.getRandBetween(1, 100)
        })
    }

    /* *************** */
    /* LOGIN FUNCTIONS */
    /* *************** */

    /**
     * Implementation required
     */
    async isLoggedIn() {
        throw new NotImplementedError('isLoggedIn not implemented');
    }

    /**
     * Implementation required
     */
    async loginWithCredentials(username, password) {
        throw new NotImplementedError('loginWithCredentials not implemented');
    }

    /**
     * Tries to log in using cookies or otherwise it throws error
     * It depends on implementation of isLoggedIn()
     * @param {*} cookies 
     * @param {string} mainUrl the url to check the login 
     */
    async loginWithSession(cookies) {
        if (!this.mainUrl) {
            throw new Error('loginWithSession: mainUrl param is not set');
        }
        console.log(`Logging into ${this.appName()} using cookies`);
        await this.page.setCookie(...cookies);
        await this.page.goto(this.mainUrl, { waitUntil: 'networkidle2' });
        await this.page.waitForTimeout(helper.getRandBetween(1500, 4000));

        await this.isLoggedIn().catch(async (error) => {
            console.error(`App is not logged into ${this.appName()}`);
            await this.writeCookiesFile("[]"); //deteling cookies file
            throw error;
        });
    }


    /**
         * Tries to login using cookies file (this.cookiesFile) and if unsuccessful it tries with credentials
         * throws MyTimeoutError if could not connect for timeout or another Error for other ones
         * If login is ok it writes the cookies to the file, if it's not it deletes them
         * Careful this function depends on implementation of isLoggedIn
         * @param {*} username username for the website
        * @param {string} password 
         */
    async login(username, password) {
        let cookies = await this.readCookiesFile();

        try {
            if (cookies && Object.keys(cookies).length) {
                await this.loginWithSession(cookies, this.mainUrl).catch(async (error) => {
                    console.error(`Unable to login using session: ${error}`);
                    if (error.name.indexOf('TimeoutError') != -1) { throw error }
                    await this.loginWithCredentials(username, password);
                });
            } else {
                await this.loginWithCredentials(username, password);
            }
        } catch (error) {
            if (error.name.indexOf('TimeoutError') != -1) {
                throw new MyTimeoutError('Connexió lenta, no s\'ha pogut fer login');
            }
            throw error;
        }

        try {
            await this.isLoggedIn();
        } catch (error) {
            console.error(`App is not logged into ${this.appName()}`);
            const screenshotLocation = await this.takeScreenshot('login_error');
            await this.writeCookiesFile("[]"); //deteling cookies file
            throw error;
        }

        // Save our freshest cookies that contain our Milanuncios session
        await this.page.cookies().then(async (freshCookies) => {
            // console.log('saving fresh cookies');
            await this.writeCookiesFile(JSON.stringify(freshCookies, null, 2));
        });

        console.log('Login ok');
    }

    /* ******************* */
    /* END LOGIN FUNCTIONS */
    /* ******************* */


    /* ******************* */
    /* BEGIN I/O FUNCTIONS */
    /* ******************* */

    /**
     * reads from local filesystem
     */
     async readCookiesFile() {
        return await helper.readJsonFile(this.cookiesFile); // Load cookies from previous session
    }

    async writeCookiesFile(stringifiedObj) {
        await helper.writeFile(this.cookiesFile, stringifiedObj);
    }

    /**
     * Will take screenshot and append the date before the desired filename
     * @param {string} filename just the name of the file without extension
     * @returns {string} screenshotLocation full screenshot location
     */
    async takeScreenshot(filename) {
        const screenshotLocation = `${this.screenshotBasepath}/${helper.dateFormatForLog()}_${filename}.png`;
        console.log(`Before taking screenshot: ${screenshotLocation}`);
        await this.page.screenshot({
            path: screenshotLocation,
            fullPage: true
        });
        return screenshotLocation;
    }

    async logIP() {
        await this.page.goto('http://checkip.amazonaws.com/');
        let current_ip_address = await this.page.evaluate(() => document.body.textContent.trim());
        await helper.writeIPToFile(current_ip_address, helper.dateFormatForLog(), this.basePath);
        console.log(current_ip_address);
        return current_ip_address
    }

    /* ******************* */
    /* END I/O FUNCTIONS */
    /* ******************* */

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

        // await this.page.evaluate(HelperPuppeteer.scrollToBottom);
    }

    enabled() {
        return config.settings.enabled;
    }

    getConfig() {
        return config;
    }

    getVersion() {
        var pjson = require('./package.json');
        return pjson.version;
    }

    async shutDown() {
        if (this.browser) {
            this.browser.close();
        }
    }

    appName() {
        return "SHOULD OVERRIDE ¯\_(ツ)_/¯ SHOULD OVERRIDE";
    }

}

module.exports = BotBase;