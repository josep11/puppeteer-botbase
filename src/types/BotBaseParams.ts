import { BrowserLauncher } from "../browser-launcher";
import { ScreenshotSaverInterface } from "../savers/screenshot-saver-interface";
import { CookieSaverInterface } from "../savers/cookie-saver-interface";

class BotBaseParams {
  mainUrl: string;

  basePath: string;

  cookieSaver: CookieSaverInterface;

  screenshotSaver: ScreenshotSaverInterface;

  browserLauncher: BrowserLauncher;

  configChild: any;

  chromiumExecutablePath: string | null;

  constructor(
    mainUrl: string,
    basePath: string,
    cookieSaver: CookieSaverInterface,
    screenshotSaver: ScreenshotSaverInterface,
    browserLauncher: BrowserLauncher,
    configChild: any,
    chromiumExecutablePath?: string | null
  ) {
    this.mainUrl = mainUrl;
    this.basePath = basePath;
    this.cookieSaver = cookieSaver;
    this.screenshotSaver = screenshotSaver;
    this.browserLauncher = browserLauncher;
    this.configChild = configChild;
    this.chromiumExecutablePath = chromiumExecutablePath || null;
  }
}

export default BotBaseParams;
