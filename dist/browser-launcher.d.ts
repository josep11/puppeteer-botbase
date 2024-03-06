export declare class BrowserLauncher {
    private puppeteer;
    constructor(puppeteer: any);
    /**
     * @param {Object} options - Options for launching the browser
     * @param {string?} [chromiumExecutablePath] - Path to chromium executable
     * @returns {Promise<Browser>}
     */
    launch(options: {}, chromiumExecutablePath: string | null): Promise<any>;
}
