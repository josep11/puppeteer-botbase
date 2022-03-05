const LocalFsCookieSaver = require("./LocalFsCookieSaver");
const path = require('path');
const LocalScreenshotSaver = require("./LocalScreenshotSaver");
const BotBase = require("./botbase");

class BotBaseFactory {
    createBotBase({
        mainUrl,
        basePath,
        configChild = {},
        chromiumExecutablePath = null
    } = {}) {
        const cookieSaver = new LocalFsCookieSaver({ cookiesFilePath: path.resolve(basePath, './res/cookies.json') });
        const screenshotSaver = new LocalScreenshotSaver({ screenshotBasepath: path.resolve(basePath, './screenshots') });

        return new BotBase({
            mainUrl,
            cookieSaver,
            screenshotSaver,
            configChild,
            chromiumExecutablePath
        });
    }
}

module.exports = BotBaseFactory;