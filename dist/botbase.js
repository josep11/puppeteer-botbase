"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotBase = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
// eslint-disable-next-line no-unused-vars
const index_1 = require("./index");
const defaultConfig_1 = require("./defaultConfig");
const path_1 = require("path");
const { waitForTimeout } = index_1.helper;
// Load the package json
const packageJsonPath = (0, path_1.resolve)("package.json");
const pjson = index_1.helper.loadJson(packageJsonPath);
class BotBase {
    /**
     * @param {BotBaseParams} params
     */
    // @ts-ignore
    constructor(params) {
        this.validateParams(params);
        this.browser = null;
        this.page = null;
        this.basePath = params.basePath;
        this.mainUrl = params.mainUrl;
        this.cookieSaver = params.cookieSaver;
        this.screenshotSaver = params.screenshotSaver;
        this.browserLauncher = params.browserLauncher;
        const configChild = params.configChild || {};
        this.config = (0, deepmerge_1.default)(defaultConfig_1.defaultConfig, configChild);
        this.chromiumExecutablePath = params.chromiumExecutablePath;
    }
    validateParams(params) {
        const { mainUrl, basePath } = params;
        if (!mainUrl || !mainUrl.includes("http")) {
            throw new Error("Invalid mainUrl");
        }
        if (!basePath) {
            throw new Error("Developer fix this: basePath is undefined");
        }
    }
    initialize(opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser != null) {
                yield this.browser.close();
                this.page = null;
            }
            const { chromiumExecutablePath } = this;
            // Use BrowserLauncher to initialize the browser.
            this.browser = yield this.browserLauncher.launch(opts, chromiumExecutablePath);
            [this.page] = yield this.browser.pages();
            yield (0, index_1.semiRandomiseViewPort)(this.page, 
            // @ts-ignore
            defaultConfig_1.defaultConfig.settings.width, 
            // @ts-ignore
            defaultConfig_1.defaultConfig.settings.height);
        });
    }
    /**
     * Prevents loading images to save CPU, memory and bandwidth
     * Careful, it will raise an error if another function already intercepted the request like in this issue (https://github.com/berstend/puppeteer-extra/issues/600)
     * @param {Page} page
     */
    interceptImages(page) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.setRequestInterception(true);
            page.on("request", (req) => {
                if (req.resourceType() === "image") {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    req.abort();
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    req.continue();
                }
            });
        });
    }
    // ********************
    // BEGIN LOGIN FUNCTIONS
    // ********************
    /**
     * Implementation required
     */
    // eslint-disable-next-line require-await
    isLoggedIn() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new index_1.NotImplementedError("isLoggedIn not implemented");
        });
    }
    /**
     * Implementation required
     */
    // eslint-disable-next-line no-unused-vars, require-await
    loginWithCredentials(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new index_1.NotImplementedError("loginWithCredentials not implemented");
        });
    }
    /**
     * @throws {Error}
     */
    checkPage() {
        if (!this.page) {
            throw Error("page is not initialised");
        }
        return this.page;
    }
    /**
     * Tries to log in using cookies, or otherwise it throws error
     * It depends on implementation of isLoggedIn()
     */
    loginWithSession(cookies) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.mainUrl) {
                throw new Error("loginWithSession: mainUrl param is not set");
            }
            this.page = this.checkPage();
            console.log(`Logging into ${this.appName()} using cookies`);
            yield this.page.setCookie(...(0, index_1.objectArrayToCookieParamArray)(cookies));
            yield this.page.goto(this.mainUrl, { waitUntil: "networkidle2" });
            yield waitForTimeout(index_1.helper.getRandBetween(1500, 4000));
            yield this.isLoggedIn().catch((error) => __awaiter(this, void 0, void 0, function* () {
                console.error(`App is not logged into ${this.appName()}`);
                yield this.writeCookiesFile([]); //deteling cookies file
                throw error;
            }));
        });
    }
    /**
     * Tries to log in using cookies file (this.cookiesFile) and if unsuccessful it tries with credentials
     * throws MyTimeoutError, when unable to connect due to timeout or another Error for other ones
     * If login is ok it writes the cookies to the file, if it's not it deletes them
     * Careful this function depends on implementation of isLoggedIn
     */
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.page = this.checkPage();
            const cookies = yield this.readCookiesFile();
            try {
                if (cookies && Object.keys(cookies).length) {
                    yield this.loginWithSession(cookies).catch((error) => __awaiter(this, void 0, void 0, function* () {
                        console.error(`Unable to login using session: ${error}`);
                        if (error.name.indexOf("TimeoutError") !== -1) {
                            throw error;
                        }
                        yield this.loginWithCredentials(username, password);
                    }));
                }
                else {
                    yield this.loginWithCredentials(username, password);
                }
            }
            catch (error) {
                if (error.name.indexOf("TimeoutError") !== -1) {
                    throw new index_1.MyTimeoutError("Connexió lenta, no s'ha pogut fer login");
                }
                throw error;
            }
            try {
                yield this.isLoggedIn();
            }
            catch (error) {
                console.error(`App is not logged into ${this.appName()}`);
                yield this.takeScreenshot("login_error");
                yield this.writeCookiesFile([]); //deteling cookies file
                throw error;
            }
            // Save our freshest cookies that contain our target page session
            yield this.page.cookies().then((freshCookies) => __awaiter(this, void 0, void 0, function* () {
                yield this.writeCookiesFile(freshCookies);
            }));
            console.log("Login ok");
        });
    }
    // ********************
    // END LOGIN FUNCTIONS
    // ********************
    // ********************
    // BEGIN I/O FUNCTIONS
    // ********************
    /**
     * reads from local filesystem
     */
    readCookiesFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cookieSaver.readCookies();
        });
    }
    writeCookiesFile(cookiesJson) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cookieSaver.writeCookies(cookiesJson);
        });
    }
    /**
     * Will take screenshot and append the date before the desired filename
     * @param {string} filename just the name of the file without extension
     * @returns {Promise<string>} screenshotLocation full screenshot location
     */
    takeScreenshot(filename) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const type = "jpeg";
            const imageBuffer = yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.screenshot({
                type,
                quality: 80,
                // omitBackground: true,
                // fullPage: true
            }));
            // await this.page.screenshot({
            //     path: screenshotLocation,
            //     fullPage: true
            // });
            if (!imageBuffer) {
                console.error("cannot take screenshot");
                return "";
            }
            return this.screenshotSaver.saveScreenshot(imageBuffer, type, filename);
        });
    }
    logIP() {
        return __awaiter(this, void 0, void 0, function* () {
            this.page = this.checkPage();
            yield this.page.goto("https://checkip.amazonaws.com/");
            const ip = yield this.page.evaluate(() => { var _a; return ((_a = document.body.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; });
            const ipFilePath = (0, path_1.join)(this.basePath, "/logs/ip.txt");
            yield index_1.helper.writeIPToFile(ip, index_1.helper.dateFormatForLog(), ipFilePath);
            return ip;
        });
    }
    // ********************
    // END I/O FUNCTIONS
    // ********************
    enabled() {
        return this.config.settings.enabled;
    }
    getConfig() {
        return this.config;
    }
    /**
     * Retrieves the version number of the botbase.
     *
     * @return {string} The version number of the botbase.
     */
    getVersion() {
        // @ts-ignore
        return pjson.version;
    }
    shutDown() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
            }
        });
    }
    /**
     *
     * @returns {string}
     */
    appName() {
        // eslint-disable-next-line no-useless-escape
        return "SHOULD OVERRIDE ¯_(ツ)_/¯ SHOULD OVERRIDE";
    }
}
exports.BotBase = BotBase;
