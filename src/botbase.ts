import deepmerge from "deepmerge";
// eslint-disable-next-line no-unused-vars
import { Browser, Page } from "puppeteer";

import path from "path";
import { config } from "../config/config";
// eslint-disable-next-line no-unused-vars
import {
  BrowserLauncher,
  helper,
  ICookieSaver,
  IScreenshotSaver,
  MyTimeoutError,
  NotImplementedError,
  semiRandomiseViewPort,
} from "../index";
import BotBaseParams from "./types/BotBaseParams";

const { waitForTimeout } = helper;

// Load the package json
const packageJsonPath = path.resolve("package.json");
const pjson = helper.loadJson(packageJsonPath);

export class BotBase {
  private browser: Browser | null;

  private page: Page | null;

  private basePath: string;

  private mainUrl: string;

  private cookieSaver: ICookieSaver;

  private screenshotSaver: IScreenshotSaver;

  private browserLauncher: BrowserLauncher;

  private config: any;

  private chromiumExecutablePath: string | null;

  /**
   * @param {BotBaseParams} params
   */
  // @ts-ignore
  constructor(params: BotBaseParams) {
    this.validateParams(params);
    this.browser = null;
    this.page = null;
    this.basePath = params.basePath;
    this.mainUrl = params.mainUrl;
    this.cookieSaver = params.cookieSaver;
    this.screenshotSaver = params.screenshotSaver;
    this.browserLauncher = params.browserLauncher;
    const configChild = params.configChild || {};
    this.config = deepmerge(config, configChild);
    this.chromiumExecutablePath = params.chromiumExecutablePath;
  }

  validateParams({
    mainUrl,
    basePath,
  } = {}) {
    if (!mainUrl || typeof mainUrl !== "string" || !mainUrl.includes("http")) {
      throw new Error("Invalid mainUrl");
    }

    if (!basePath) {
      throw new Error("Developer fix this: basePath is undefined");
    }
  }

  async initialize(opts = {}) {
    if (this.browser != null) {
      await this.browser.close();
      this.page = null;
    }

    const { chromiumExecutablePath } = this;

    // Use BrowserLauncher to initialize the browser.
    this.browser = await this.browserLauncher.launch(
      opts,
      chromiumExecutablePath
    );

    [this.page] = await this.browser!.pages();

    await semiRandomiseViewPort(
      this.page,
      config.settings.width,
      config.settings.height
    );
  }

  /**
   * Prevents loading images to save CPU, memory and bandwidth
   * Careful, it will raise an error if another function already intercepted the request like in this issue (https://github.com/berstend/puppeteer-extra/issues/600)
   * @param {Page} page
   */
  async interceptImages(page: Page) {
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.resourceType() === "image") {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  // ********************
  // BEGIN LOGIN FUNCTIONS
  // ********************

  /**
   * Implementation required
   */
  // eslint-disable-next-line require-await
  async isLoggedIn() {
    throw new NotImplementedError("isLoggedIn not implemented");
  }

  /**
   * Implementation required
   */
  // eslint-disable-next-line no-unused-vars, require-await
  async loginWithCredentials(username: string, password: string) {
    throw new NotImplementedError("loginWithCredentials not implemented");
  }

  /**
   * @throws {Error}
   */
  checkPage(): Page {
    if (!this.page) {
      throw Error("page is not initialised");
    }
    return this.page;
  }

  /**
   * Tries to log in using cookies, or otherwise it throws error
   * It depends on implementation of isLoggedIn()
   * @param {*} cookies
   */
  async loginWithSession(cookies) {
    if (!this.mainUrl) {
      throw new Error("loginWithSession: mainUrl param is not set");
    }
    this.page = this.checkPage();
    console.log(`Logging into ${this.appName()} using cookies`);
    await this.page.setCookie(...cookies);
    await this.page.goto(this.mainUrl, { waitUntil: "networkidle2" });
    await waitForTimeout(helper.getRandBetween(1500, 4000));

    await this.isLoggedIn().catch(async (error) => {
      console.error(`App is not logged into ${this.appName()}`);
      await this.writeCookiesFile([]); //deteling cookies file
      throw error;
    });
  }

  /**
   * Tries to log in using cookies file (this.cookiesFile) and if unsuccessful it tries with credentials
   * throws MyTimeoutError, when unable to connect due to timeout or another Error for other ones
   * If login is ok it writes the cookies to the file, if it's not it deletes them
   * Careful this function depends on implementation of isLoggedIn
   * @param {*} username username for the website
   * @param {string} password
   */
  async login(username, password) {
    this.page = this.checkPage();

    const cookies = await this.readCookiesFile();

    try {
      if (cookies && Object.keys(cookies).length) {
        await this.loginWithSession(cookies).catch(async (error) => {
          console.error(`Unable to login using session: ${error}`);
          if (error.name.indexOf("TimeoutError") !== -1) {
            throw error;
          }
          await this.loginWithCredentials(username, password);
        });
      } else {
        await this.loginWithCredentials(username, password);
      }
    } catch (error) {
      if (error.name.indexOf("TimeoutError") !== -1) {
        throw new MyTimeoutError("Connexió lenta, no s'ha pogut fer login");
      }
      throw error;
    }

    try {
      await this.isLoggedIn();
    } catch (error) {
      console.error(`App is not logged into ${this.appName()}`);
      await this.takeScreenshot("login_error");
      await this.writeCookiesFile([]); //deteling cookies file
      throw error;
    }

    // Save our freshest cookies that contain our Milanuncios session
    await this.page.cookies().then(async (freshCookies) => {
      await this.writeCookiesFile(freshCookies);
    });

    console.log("Login ok");
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
  async readCookiesFile() {
    return await this.cookieSaver.readCookies();
  }

  async writeCookiesFile(cookiesJson) {
    await this.cookieSaver.writeCookies(cookiesJson);
  }

  /**
   * Will take screenshot and append the date before the desired filename
   * @param {string} filename just the name of the file without extension
   * @returns {Promise<string>} screenshotLocation full screenshot location
   */
  async takeScreenshot(filename) {
    const type = "jpeg";
    const imageBuffer = await this.page?.screenshot({
      type,
      quality: 80,
      // omitBackground: true,
      // fullPage: true
    });
    // await this.page.screenshot({
    //     path: screenshotLocation,
    //     fullPage: true
    // });
    return this.screenshotSaver.saveScreenshot({
      imageBuffer,
      filename,
      type,
    });
  }

  async logIP() {
    this.page = this.checkPage();

    await this.page.goto("https://checkip.amazonaws.com/");
    const ip = await this.page.evaluate(
      () => document.body.textContent?.trim() || ""
    );

    const ipFilePath = path.join(this.basePath, "/logs/ip.txt");
    await helper.writeIPToFile(ip, helper.dateFormatForLog(), ipFilePath);
    return ip;
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
    return pjson.version;
  }

  async shutDown() {
    if (this.browser) {
      await this.browser.close();
    }
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
