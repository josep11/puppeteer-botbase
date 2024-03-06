import { Page } from "puppeteer";
import { BrowserLauncher, CookieSaverInterface, ScreenshotSaverInterface } from "./index";
import BotBaseParams from "./types/BotBaseParams";
export declare class BotBase {
    private browser;
    page: Page | null;
    protected readonly basePath: string;
    protected mainUrl: string;
    protected cookieSaver: CookieSaverInterface;
    protected screenshotSaver: ScreenshotSaverInterface;
    protected browserLauncher: BrowserLauncher;
    protected config: any;
    protected chromiumExecutablePath: string | null;
    /**
     * @param {BotBaseParams} params
     */
    constructor(params: BotBaseParams);
    validateParams(params: BotBaseParams): void;
    initialize(opts?: {}): Promise<void>;
    /**
     * Prevents loading images to save CPU, memory and bandwidth
     * Careful, it will raise an error if another function already intercepted the request like in this issue (https://github.com/berstend/puppeteer-extra/issues/600)
     * @param {Page} page
     */
    interceptImages(page: Page): Promise<void>;
    /**
     * Implementation required
     */
    isLoggedIn(): Promise<void>;
    /**
     * Implementation required
     */
    loginWithCredentials(username: string, password: string): Promise<void>;
    /**
     * @throws {Error}
     */
    checkPage(): Page;
    /**
     * Tries to log in using cookies, or otherwise it throws error
     * It depends on implementation of isLoggedIn()
     */
    loginWithSession(cookies: object[]): Promise<void>;
    /**
     * Tries to log in using cookies file (this.cookiesFile) and if unsuccessful it tries with credentials
     * throws MyTimeoutError, when unable to connect due to timeout or another Error for other ones
     * If login is ok it writes the cookies to the file, if it's not it deletes them
     * Careful this function depends on implementation of isLoggedIn
     */
    login(username: string, password: string): Promise<void>;
    /**
     * reads from local filesystem
     */
    readCookiesFile(): Promise<object[]>;
    writeCookiesFile(cookiesJson: string | object): Promise<void>;
    /**
     * Will take screenshot and append the date before the desired filename
     * @param {string} filename just the name of the file without extension
     * @returns {Promise<string>} screenshotLocation full screenshot location
     */
    takeScreenshot(filename: string): Promise<string>;
    logIP(): Promise<string>;
    enabled(): any;
    getConfig(): any;
    /**
     * Retrieves the version number of the botbase.
     *
     * @return {string} The version number of the botbase.
     */
    getVersion(): string;
    shutDown(): Promise<void>;
    /**
     *
     * @returns {string}
     */
    appName(): string;
}
