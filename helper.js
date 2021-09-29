const path = require('path');

const { promises: fs } = require("fs");
const { exec: execAsync } = require('child-process-async');
const util = require('util');
const moment = require('moment');

class Helper {
    delay() { return util.promisify(setTimeout) }

    printDate(channel = console.log) {
        let day = this.getNow();
        // console.log('---------------------------------------');
        channel('----------' + day + '----------');
        // console.log('---------------------------------------');
    }
    dateFormatForLog() {
        return moment(new Date()).format("yyyy-MM-DD_hh.mm.ss");
    }
    /**
     * This function gets the difference in hours from the param with the actual moment
     * @param {Date} pastTime 
     */
    getDiferenceInHours(pastTime) {
        let now = moment();    // get "now" as a moment
        let momentStart = moment(pastTime);
        let duration = moment.duration(now.diff(momentStart));
        const hours = duration.asHours();
        return hours;
    }
    getNow() {
        return moment().format();
    }
    getNowMinus(hoursAgo = 0) {
        return moment().subtract(hoursAgo, 'hours').format();
    }
    getRandBetween(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async textExistsInPage(page, text) {
        let found = await page.$x(`//*[contains(., "${text}")]`);
        return found.length > 0;
    }
    /**
     * 
     * @param {string} timeStr 
     * @returns Number
     */
    extractHorasFromString(timeStr) {
        // 23 horas
        if (!timeStr) return null;

        if (timeStr.indexOf('hora') != -1) {
            const horas = timeStr.match(/\d+/)[0];

            return parseInt(horas);
        } else {
            if (timeStr.indexOf('seg') != -1 || timeStr.indexOf('min') != -1) {
                return 0;
            }
            if (timeStr.indexOf('día') != -1) {
                return 25;
            }
            throw (`FIXME: Helper.extractHorasFromString: En la string the time no se encontró 'hora'. Input timeStr = ${timeStr}`);
        }
    }
    async getIp() {
        const { stdout, stderr } = await execAsync(`curl checkip.amazonaws.com`);
        if (!stdout) {
            console.error('IP no trobada a amazon');
            console.error(stderr);
            return '';
        }
        return stdout.trim();
    }


    /*****************************************/
    /* BEGIN I/O FUNCTIONS TO THE FILESYSTEM */
    /*****************************************/

    /**
     * 
     * @param {string} ip 
     * @param {string} date 
     * @param {string} basePath defaults to current dir 
     * @returns undefined if no error happened or string with error message otherwise
     */
    async writeIPToFile(ip, date, basePath = __dirname) {
        const ip_file = path.resolve(basePath, "./logs/ip.txt");
        try {
            await fs.appendFile(ip_file, `Data: ${date}\nIP: ${ip}\n\n`);
        }
        catch (err) {
            console.error(`cannot write to file ${ip_file}. Error: ${err}`);
            return `cannot write to file ${ip_file}. Error: ${err}`;
        }
        return undefined;
    }
    async writeFile(filename, text) {
        const nBytes = await fs.writeFile(filename, text);
        return nBytes;
        //TODO: check
        // catch (err) {
        //     console.error(`cannot write to file ${filename}. Error: ${err}`);
        // }
    }
    async readFile(filename) {
        let content = await fs.readFile(filename, "utf-8");
        return content;
    }
    async emptyFile(filename) {
        return await this.writeFile(filename, '');
    }
    async readJsonFile(cookiesFile) {
        try {
            const myJsonObject = require(cookiesFile);
            return myJsonObject;
        } catch (err) {
            console.error("Reading cookie error. Defaulting to [] \n\n" + err)
            return [];
        }
    }
    createDirIfNotExists(dir) {
        var fs = require('fs');

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    async logJSONdebug(jsonStr, basePath = __dirname) {
        const dir = path.resolve(basePath, `./logs/dataset`);
        this.createDirIfNotExists(dir);
        const filenameFullPath = path.resolve(dir, `data_${this.dateFormatForLog()}.json`);
        try {
            await fs.writeFile(filenameFullPath, jsonStr);
            console.log(`file written successfully to ${filenameFullPath}`);
            return filenameFullPath;
        }
        catch (err) {
            console.error(`cannot write to file ${filenameFullPath}. Error: ${err}`);
        }
    }

    /***************************************/
    /* END I/O FUNCTIONS TO THE FILESYSTEM */
    /***************************************/


    /**
     * This function is deprecated with the RenewManager no need to run this function in the browser context
     * @param {*} timeStr 
     * @param {*} HOURS_NEED_TO_RENEW 
     */
    needToRenew(timeStr, HOURS_NEED_TO_RENEW) {
        if (timeStr.indexOf('min') != -1 || timeStr.indexOf('seg') != -1) {
            return false;
        }
        if (timeStr.indexOf('día') != -1) {
            return true;
        }
        if (timeStr.indexOf('horas') != -1) {
            const horas = timeStr.match(/\d+/)[0];
            if (horas >= HOURS_NEED_TO_RENEW) {
                return true;
            }
        } else {
            console.error("FIXME: En la string the time no se encontró ni 'min', 'seg', 'día', 'hora'");
        }
        return false;
    }
    getRanomisedUserAgend() {
        //Working but unused in this project

        // const UserAgent = require("user-agents");
        // const userAgent = new UserAgent({
        //     deviceCategory: "desktop",
        //     platform: "MacIntel" //"Linux x86_64",
        // });
        // return userAgent;
    }
}


module.exports = new Helper();
