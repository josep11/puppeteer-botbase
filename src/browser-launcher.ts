/* eslint-disable no-unused-vars */
import { Browser } from "puppeteer";

export class BrowserLauncher {
  // TODO: maybe fix type?
  private puppeteer: any;

  constructor(puppeteer: any) {
    this.puppeteer = puppeteer;
  }

  /**
   * @param {Object} options - Options for launching the browser
   * @param {string?} [chromiumExecutablePath] - Path to chromium executable
   * @returns {Promise<Browser>}
   */
  async launch(options: {}, chromiumExecutablePath: string | null) {
    if (chromiumExecutablePath) {
      options = { ...options, executablePath: chromiumExecutablePath };
    }

    return await this.puppeteer.launch(options);
  }
}
