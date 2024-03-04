import { ICookieSaver } from "../ICookieSaver";
import { IScreenshotSaver } from "../IScreenshotSaver";
import { BrowserLauncher } from "../browser-launcher";

class BotBaseParams {
  mainUrl: string;

  basePath: string;

  cookieSaver: ICookieSaver;

  screenshotSaver: IScreenshotSaver;

  browserLauncher: BrowserLauncher;

  configChild: any;

  chromiumExecutablePath: string | null;

  constructor(
    mainUrl: string,
    basePath: string,
    cookieSaver: ICookieSaver,
    screenshotSaver: IScreenshotSaver,
    browserLauncher: BrowserLauncher,
    configChild: any,
    chromiumExecutablePath: string | null
  ) {
    this.mainUrl = mainUrl;
    this.basePath = basePath;
    this.cookieSaver = cookieSaver;
    this.screenshotSaver = screenshotSaver;
    this.browserLauncher = browserLauncher;
    this.configChild = configChild;
    this.chromiumExecutablePath = chromiumExecutablePath;
  }
}

export default BotBaseParams;
