class HelperPuppeteer {

    /**
     * The same as closePopup but the text will also be found on child elements. Warning: will click only the first element found, so it may be the parent if more than one node matching is found. 
     * That's why it is recommended to set the @element param to narrow down the search
     * @param {*} page Puppeteer page
     * @param {string?} textBtnOrChildren the text to find
     * @param {string?} element the tag refering to the dom element
     * @returns {boolean} true if the element was clicked, false otherwise
     */
    static async closePopupByTextContaining(page, textBtnOrChildren = "Aceptar y cerrar", element = "*") {
        const btn = await page.$x(`//${element}[contains(., "${textBtnOrChildren}")]`);
        let clicked = false;
        if (btn && btn.length == 0) {
            console.debug(`popup with text '${textBtnOrChildren}' not found ... continuing`);
        } else {
            try {
                await btn[0].click();
                clicked = true;
                await page.waitForTimeout(1500);
            } catch (err) {
                console.error(`error clicking popup button. '${textBtnOrChildren}' (element="${element}"). Continuing ...`);
            }
        }

        return clicked;
    }
    /**
     * 
     * @param {*} page Puppeteer page
     * @param {string?} textBtn the exact text to find
     * @param {string?} element the tag refering to the dom element
     * @returns {boolean} true if the element was clicked, false otherwise
     */
    static async closePopup(page, textBtn = "Aceptar y cerrar", element = "*") {
        const btn = await page.$x(`//${element}[contains(text(), "${textBtn}")]`);
        let clicked = false;
        if (btn && btn.length == 0) {
            console.debug(`popup with text '${textBtn}' not found ... continuing`);
        } else {
            try {
                await btn[0].click();
                clicked = true;
                await page.waitForTimeout(1500);
            } catch (err) {
                console.error(`error clicking popup button. '${textBtn}' (element="${element}"). Continuing ...`);
            }
        }

        return clicked;
    }

    /**
     * Finds texts (ignoring case) on page text
     * @param {*} page Puppeteer Page
     * @param {string} text Text to find
     * @returns true or false
     */
    static async isTextPresentOnWebpage(page, text, ignoreCase = true) {
        let options = ignoreCase ? 'gi' : 'g';
        const innerText = await page.evaluate(() => document.body.innerText);
        const regex = new RegExp(text, options);
        if (regex.test(innerText)) {
            return true;
        }
        console.error(`Text "${text}" is not found in document body on ${page.url()}`);
        return false;
    }

    static async scrollToBottom() { //Will be evaluated in browser context, so constant goes here
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

}

module.exports = HelperPuppeteer;