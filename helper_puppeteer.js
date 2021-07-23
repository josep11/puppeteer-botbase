const { RefusedConnectionMilanuncios } = require('./CustomErrors')
const Helper = require('./helper');
const helper = new Helper();

class HelperPuppeteer {

    static async closePopup(page, textBtn = "Aceptar y cerrar", element = "*") {
        let btn = await page.$x(`//${element}[contains(text(), "${textBtn}")]`);
        if (btn && btn.length == 0) {
            console.debug(`popup with text ${textBtn} not found ... continuing`);
        } else {
            try {
                await btn[0].click();
            } catch (err) {
                console.error("error clicking popup button. \"" + textBtn + "\" (element=" + element + "). Continuing ...");
            }
        }

        await page.waitForTimeout(1500);
    }

    static async scrollToBottom () { //Will be evaluated in browser context, so constant goes here
        const DISTANCE_SCROLL = Math.floor(Math.random() * (100 - 65 + 1)) + 65; //pseudo randomising distance_scroll bw 65 and 100
        await new Promise(resolve => {
            const distance = DISTANCE_SCROLL; // should be less than or equal to window.innerHeight
            const delay = 100;
            const timer = setInterval(() => {
                document.scrollingElement.scrollBy(0, distance);
                if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, delay);
        });
    }

};

module.exports = HelperPuppeteer;