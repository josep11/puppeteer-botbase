const glob = require("glob");

console.log(getLocalPuppeteerInstallation());

function getLocalPuppeteerInstallation() {

    // const puppeteerDirname = './node_modules/puppeteer/.local-chromium/mac-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium'
    // example path for linux:
    // './node_modules/puppeteer/.local-chromium/linux-970485/chrome-linux/chrome'
    // './node_modules/puppeteer/.local-chromium/linux-624492/chrome-linux'
    // example path for mac (tested and working):
    const puppeteerDirnameMac = './node_modules/puppeteer/.local-chromium/mac-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium'
    const puppeteerDirnameLinux = './node_modules/puppeteer/.local-chromium/linux-*/chrome-linux/chrome'
    const puppeteerDirnames = [puppeteerDirnameLinux, puppeteerDirnameMac];
    for (const puppeteerDirname of puppeteerDirnames) {
        const results = glob.sync(puppeteerDirname);
        console.log(results);
        if (!results || results.length < 1) {
            return results[0];
        }
    }

    throw 'Puppeteer not installed';
}