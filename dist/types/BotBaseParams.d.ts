import { BrowserLauncher } from "../browser-launcher";
import { ScreenshotSaverInterface } from "../savers/screenshot-saver-interface";
import { CookieSaverInterface } from "../savers/cookie-saver-interface";
declare class BotBaseParams {
    mainUrl: string;
    basePath: string;
    cookieSaver: CookieSaverInterface;
    screenshotSaver: ScreenshotSaverInterface;
    browserLauncher: BrowserLauncher;
    configChild: any;
    chromiumExecutablePath: string | null;
    constructor(mainUrl: string, basePath: string, cookieSaver: CookieSaverInterface, screenshotSaver: ScreenshotSaverInterface, browserLauncher: BrowserLauncher, configChild: any, chromiumExecutablePath?: string | null);
}
export default BotBaseParams;
