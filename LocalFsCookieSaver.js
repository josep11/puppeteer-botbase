const fs = require('fs');
const { dirname } = require('path');
const { createDirIfNotExists } = require('./helper');
const ICookieSaver = require('./ICookieSaver');

class LocalFsCookieSaver extends ICookieSaver {
    /**
     * 
     * @param {obj} param should have the following keys { cookiesFilePath }
     */
    constructor({ cookiesFilePath }) {
        super();
        if (!cookiesFilePath || typeof cookiesFilePath != "string") {
            throw new Error('Developer fix this: cookiesFilePath is undefined or not string');
        }

        this.cookiesFilePath = cookiesFilePath;

        createDirIfNotExists(dirname(this.cookiesFilePath))
    }

    async readCookies() {
        try {
            const jsonString = fs.readFileSync(this.cookiesFilePath);
            const cookies = JSON.parse(jsonString);
            return cookies;
        } catch (err) {
            console.error("Reading cookie error. Defaulting to [] \n\n" + err)
            return [];
        }
    }

    /**
     * 
     * @param {*} cookiesJson 
     * @returns 
     */
    async writeCookies(cookiesJson) {
        if (typeof cookiesJson !== 'object') {
            throw new Error('cookiesJson parameter is not of type object.')
        }
        return fs.writeFileSync(this.cookiesFilePath, JSON.stringify(cookiesJson, null, 2));
    }

    /**
     * When extending it, should save "[]" as empty cookie
     */
    async removeCookies() {
        await this.writeCookies('[]');
    }

}

module.exports = LocalFsCookieSaver;