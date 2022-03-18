const glob = require("glob");

console.log(getLocalPuppeteerInstallation());

function getLocalPuppeteerInstallation() {
    // TODO: port it to other OS's
    // fails on circleci
    const puppeteerDirname = './node_modules/puppeteer/.local-chromium/*'
    // '/web/node_modules/prerender-spa-plugin/node_modules/puppeteer/.local-chromium/linux-624492/chrome-linux'
    const results = glob.sync(puppeteerDirname);
    console.log(results);
    if (!results || results.length < 1) {
        throw 'Puppeteer not installed'
    }
    return results[0];
}