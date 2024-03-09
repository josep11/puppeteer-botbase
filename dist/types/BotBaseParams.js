"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BotBaseParams {
    constructor(mainUrl, basePath, cookieSaver, screenshotSaver, browserLauncher, configChild, chromiumExecutablePath) {
        this.mainUrl = mainUrl;
        this.basePath = basePath;
        this.cookieSaver = cookieSaver;
        this.screenshotSaver = screenshotSaver;
        this.browserLauncher = browserLauncher;
        this.configChild = configChild;
        this.chromiumExecutablePath = chromiumExecutablePath || null;
    }
}
exports.default = BotBaseParams;
