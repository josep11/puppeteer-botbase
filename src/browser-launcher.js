export class BrowserLauncher {
  constructor(puppeteer) {
    this.puppeteer = puppeteer;
  }

  /**
   * @param {Object} options - Options for launching the browser
   * @param {string?} [chromiumExecutablePath] - Path to chromium executable
   * @returns {Promise<import('puppeteer').Browser>}
   */
  async launch(options, chromiumExecutablePath) {
    if (chromiumExecutablePath) {
      options = { ...options, executablePath: chromiumExecutablePath };
    }

    return await this.puppeteer.launch(options);
  }
}
