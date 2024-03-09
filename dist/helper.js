"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helper = void 0;
// Node.js built-in modules
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
// Third-party libraries
const luxon_1 = require("luxon");
const user_agents_1 = __importDefault(require("user-agents"));
const exec = (0, util_1.promisify)(child_process_1.exec);
// const __dirname = path.dirname(__filename);
class Helper {
    constructor() {
        /**
         * @param {number} in milliseconds
         * @returns {function}
         */
        this.delay = (0, util_1.promisify)(setTimeout);
    }
    printDate(channel = console.log) {
        // console.log('---------------------------------------');
        channel("----------" + this.getNow() + "----------");
        // console.log('---------------------------------------');
    }
    dateFormatForLog() {
        return luxon_1.DateTime.now().toFormat("yyyy-LL-dd_HH.mm.ss");
    }
    consoleListener(message) {
        const type = message.type().substring(0, 3).toUpperCase();
        if (type === "WAR" || type === "INF") {
            return;
        }
        console.info(`${type} ${message.text()}`);
    }
    /**
     * @param {number} milliseconds - the number of milliseconds to wait.
     */
    waitForTimeout(milliseconds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((r) => setTimeout(r, milliseconds));
        });
    }
    /**
     * This function calculates the difference in hours between the pastTime parameter and the current datetime.
     * @param {string | Date} pastTime - The past time to compare with the current datetime. It can be either a string in ISO 8601 format or a Date object.
     * @return {number} - The difference in hours between the pastTime and the current datetime.
     */
    getDiferenceInHours(pastTime) {
        const now = luxon_1.DateTime.local();
        let dateTimeStart;
        if (typeof pastTime === "string") {
            dateTimeStart = luxon_1.DateTime.fromISO(pastTime);
        }
        else {
            dateTimeStart = luxon_1.DateTime.fromJSDate(pastTime);
        }
        return luxon_1.Duration.fromMillis(now.diff(dateTimeStart).valueOf()).as("hours");
    }
    /**
     * Returns date in format YYYY-MM-DD = 2021-10-30
     */
    getDate() {
        return luxon_1.DateTime.local().toFormat("yyyy-LL-dd");
    }
    /**
     * @return {string} The ISO formatted string representation of now
     */
    getNow() {
        return luxon_1.DateTime.local().toISO();
    }
    /**
     * Returns the ISO formatted string representation of the current date and time
     * minus the specified number of hours.
     *
     * @param {number} [hoursAgo=0] - The number of hours to subtract from the current date and time.
     * @return {string} The ISO formatted string representation of the current date and time
     * minus the specified number of hours.
     */
    getNowMinus(hoursAgo = 0) {
        const millis = this.hoursToMillis(hoursAgo);
        const duration = luxon_1.Duration.fromMillis(millis);
        return luxon_1.DateTime.local().minus(duration).toISO();
    }
    /**
     * @param {number} hours
     * @return {number} milliseconds
     */
    hoursToMillis(hours) {
        return hours * 60 * 60 * 1000;
    }
    getRandBetween(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * @param array
     * @param callbackfn
     */
    mapAsync(array, 
    // eslint-disable-next-line no-unused-vars
    callbackfn) {
        return Promise.all(array.map(callbackfn));
    }
    /**
     *
     * @param array array to filter
     * @param callbackfn  should be a function that returns a Promise
     * @returns
     */
    filterAsync(array, 
    // eslint-disable-next-line no-unused-vars
    callbackfn) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterMap = yield this.mapAsync(array, callbackfn);
            return array.filter((_, index) => filterMap[index]);
        });
    }
    /**
     *
     * @param {string} text
     * @param {string} textToFind
     * @returns {number}
     */
    countStringOccurrences(text, textToFind) {
        const re = new RegExp(textToFind, "gi");
        return (text.match(re) || []).length;
    }
    /**
     *
     * @param {string} timeStr
     * @returns {number|null}
     */
    extractHorasFromString(timeStr) {
        // 23 horas
        if (!timeStr) {
            return null;
        }
        if (timeStr.indexOf("hora") !== -1) {
            const m = timeStr.match(/\d+/);
            if (!m) {
                return null;
            }
            const horas = m[0];
            return parseInt(horas);
        }
        else {
            if (timeStr.indexOf("seg") !== -1 || timeStr.indexOf("min") !== -1) {
                return 0;
            }
            if (timeStr.indexOf("día") !== -1) {
                return 25;
            }
            throw `FIXME: Helper.extractHorasFromString: En la string timeStr no s'ha trobat 'hora'. Input timeStr = ${timeStr}`;
        }
    }
    getIp() {
        return __awaiter(this, void 0, void 0, function* () {
            const { stdout, stderr } = yield exec(`curl checkip.amazonaws.com`);
            if (!stdout) {
                console.error("IP no trobada a amazon");
                console.error(stderr);
                return "";
            }
            return stdout.trim();
        });
    }
    /*****************************************/
    /* BEGIN I/O FUNCTIONS TO THE FILESYSTEM */
    /*****************************************/
    /**
     * @param {string} ip
     * @param {string} date
     * @param {PathLike} ipFilePath the file where to save it
     */
    writeIPToFile(ip, date, ipFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.promises.appendFile(ipFilePath, `Data: ${date}\nIP: ${ip}\n\n`);
            }
            catch (err) {
                console.error(`cannot write to file ${ipFilePath}. Error: ${err}`);
                throw Error(`cannot write to file ${ipFilePath}. Error: ${err}`);
            }
        });
    }
    /**
     *
     * @param {string} filename
     * @param {string} content
     */
    writeFile(filename, content) {
        return __awaiter(this, void 0, void 0, function* () {
            // noinspection UnnecessaryLocalVariableJS
            yield fs_1.promises.writeFile(filename, content);
        });
    }
    /**
     * Will write the text to the filename. Newlines should be explicitly set.
     * @param {string} filename filename to write to
     * @param {string} text text to write
     * @returns
     */
    appendFile(filename, text) {
        return __awaiter(this, void 0, void 0, function* () {
            // noinspection UnnecessaryLocalVariableJS
            yield fs_1.promises.appendFile(filename, text, "utf-8");
        });
    }
    /**
     * @param {string} filename
     * @returns {Promise<string>} the content of the file
     */
    readFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const encoding = "utf-8";
            const buffer = yield fs_1.promises.readFile(filename, { encoding });
            return buffer.toString();
        });
    }
    emptyFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.writeFile(filename, "");
        });
    }
    /**
     * @param {string} filePath - The path to the JSON file to load.
     * @return {object} the parsed JSON object.
     * @throws {SyntaxError} when the JSON is malformed
     */
    loadJson(filePath) {
        const jsonString = (0, fs_1.readFileSync)(filePath);
        return JSON.parse(jsonString.toString());
    }
    createDirIfNotExists(dir) {
        if (!(0, fs_1.existsSync)(dir)) {
            (0, fs_1.mkdirSync)(dir, { recursive: true });
        }
    }
    rmFileIfExists(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.promises.stat(file);
                // console.log(`removing ${file}`);
                yield fs_1.promises.unlink(file);
            }
            catch (err) {
                if (err.code === "ENOENT") {
                    // console.error(`The file ${file} does not exist`);
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * @param {string} jsonStr
     * @param basePath
     */
    logJSONdebug(jsonStr, basePath = __dirname) {
        return __awaiter(this, void 0, void 0, function* () {
            const dir = (0, path_1.resolve)(basePath, `./logs/dataset`);
            this.createDirIfNotExists(dir);
            const filenameFullPath = (0, path_1.resolve)(dir, `data_${this.dateFormatForLog()}.json`);
            try {
                yield fs_1.promises.writeFile(filenameFullPath, jsonStr);
                console.log(`file written successfully to ${filenameFullPath}`);
                return filenameFullPath;
            }
            catch (err) {
                console.error(`cannot write to file ${filenameFullPath}. Error: ${err}`);
            }
        });
    }
    /***************************************/
    /* END I/O FUNCTIONS TO THE FILESYSTEM */
    /***************************************/
    /**
     * Used by the V1 version of user-agents.
     */
    getRanomisedUserAgentV1() {
        let userAgent = new user_agents_1.default({
            deviceCategory: "desktop",
            platform: "MacIntel", //"Linux x86_64",
            vendor: "Google Inc.",
        });
        return userAgent.random().toString();
    }
    // #getRanomisedUserAgentV0() {
    //   const userAgents = require("user-agents");
    //   return userAgents.random();
    // }
    getRanomisedUserAgent() {
        return this.getRanomisedUserAgentV1();
    }
}
exports.helper = new Helper();
