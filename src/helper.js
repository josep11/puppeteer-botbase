// Node.js built-in modules
import path from "path";
import { exec as callbackExec } from "child_process";
import { promisify } from "util";
import { promises as fs, readFileSync, existsSync, mkdirSync } from "fs";

// Third-party libraries
import { DateTime, Duration } from "luxon";

// eslint-disable-next-line no-unused-vars
import UserAgents from "user-agents";

const exec = promisify(callbackExec);

class Helper {
  constructor() {
    /**
     * @param {number} in milliseconds
     * @returns {function}
     */
    this.delay = promisify(setTimeout);
  }

  printDate(channel = console.log) {
    // console.log('---------------------------------------');
    channel("----------" + this.getNow() + "----------");
    // console.log('---------------------------------------');
  }

  dateFormatForLog() {
    return DateTime.now().toFormat("yyyy-LL-dd_HH.mm.ss");
  }

  consoleListener(message) {
    const type = message.type().substr(0, 3).toUpperCase();
    if (type === "WAR" || type === "INF") {
      return;
    }
    console.info(`${type} ${message.text()}`);
  }

  /**
   * @param {number} milliseconds - the number of milliseconds to wait.
   */
  async waitForTimeout(milliseconds) {
    await new Promise((r) => setTimeout(r, milliseconds));
  }

  /**
   * This function gets the difference in hours from the param with the actual datetime
   * @param {string | Date} pastTime
   */
  getDiferenceInHours(pastTime) {
    const now = DateTime.local();

    let dateTimeStart;
    if (typeof pastTime === "string") {
      dateTimeStart = DateTime.fromISO(pastTime);
    } else {
      dateTimeStart = DateTime.fromJSDate(pastTime);
    }

    return Duration.fromMillis(now.diff(dateTimeStart).valueOf()).as("hours");
  }

  /**
   * Returns date in format YYYY-MM-DD = 2021-10-30
   */
  getDate() {
    return DateTime.local().toFormat("yyyy-LL-dd");
  }

  getNow() {
    return DateTime.local().toISO();
  }

  getNowMinus(hoursAgo = 0) {
    return DateTime.local().minus({ hours: hoursAgo }).toISO();
  }

  /**
   * @param {number} min
   * @param {number} max
   */
  getRandBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * @param {any[]} array
   * @param {(value: any, index: number, array: any[]) => any} callbackfn
   */
  mapAsync(array, callbackfn) {
    return Promise.all(array.map(callbackfn));
  }

  /**
   *
   * @param {array} array array to filter
   * @param {(value: any, index: number, array: any[]) => any} callbackfn should be a function that returns a Promise
   * @returns
   */
  async filterAsync(array, callbackfn) {
    const filterMap = await this.mapAsync(array, callbackfn);
    return array.filter((value, index) => filterMap[index]);
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
    } else {
      if (timeStr.indexOf("seg") !== -1 || timeStr.indexOf("min") !== -1) {
        return 0;
      }
      if (timeStr.indexOf("día") !== -1) {
        return 25;
      }
      throw `FIXME: Helper.extractHorasFromString: En la string timeStr no s'ha trobat 'hora'. Input timeStr = ${timeStr}`;
    }
  }

  async getIp() {
    const { stdout, stderr } = await exec(`curl checkip.amazonaws.com`);
    if (!stdout) {
      console.error("IP no trobada a amazon");
      console.error(stderr);
      return "";
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
    const ip_file = path.resolve(basePath, "../logs/ip.txt");
    try {
      await fs.appendFile(ip_file, `Data: ${date}\nIP: ${ip}\n\n`);
    } catch (err) {
      console.error(`cannot write to file ${ip_file}. Error: ${err}`);
      return `cannot write to file ${ip_file}. Error: ${err}`;
    }
    return undefined;
  }

  /**
   *
   * @param {string} filename
   * @param {string} content
   * @returns
   */
  async writeFile(filename, content) {
    // noinspection UnnecessaryLocalVariableJS
    const nBytes = await fs.writeFile(filename, content);
    return nBytes;
  }

  /**
   * Will write the text to the filename. Newlines should be explicitly set.
   * @param {string} filename filename to write to
   * @param {string} text text to write
   * @returns
   */
  async appendFile(filename, text) {
    // noinspection UnnecessaryLocalVariableJS
    const nBytes = await fs.appendFile(filename, text, "utf-8");
    return nBytes;
  }

  /**
   *
   * @param {string} filename
   * @returns {Promise<string>} the content of the file
   */
  async readFile(filename) {
    return await fs.readFile(filename, "utf-8");
  }

  async emptyFile(filename) {
    return await this.writeFile(filename, "");
  }

  /**
   * @param {string} filePath - The path to the JSON file to load.
   * @return {object} the parsed JSON object.
   * @throws {SyntaxError} when the JSON is malformed
   */
  loadJson(filePath) {
    const jsonString = readFileSync(filePath);
    return JSON.parse(jsonString.toString());
  }

  /**
   * @param {fs.PathLike} dir
   */
  createDirIfNotExists(dir) {
    if (!existsSync(dir)) {
     mkdirSync(dir, { recursive: true });
    }
  }

  /**
   *
   * @param {string} file The file to remove
   */
  async rmFileIfExists(file) {
    try {
      await fs.stat(file);
      // console.log(`removing ${file}`);
      await fs.unlink(file);
    } catch (err) {
      if (err.code === "ENOENT") {
        // console.error(`The file ${file} does not exist`);
      } else {
        throw err;
      }
    }
  }

  /**
   * @param {string} jsonStr
   * @param basePath
   */
  async logJSONdebug(jsonStr, basePath = __dirname) {
    const dir = path.resolve(basePath, `./logs/dataset`);
    this.createDirIfNotExists(dir);
    const filenameFullPath = path.resolve(
      dir,
      `data_${this.dateFormatForLog()}.json`,
    );
    try {
      await fs.writeFile(filenameFullPath, jsonStr);
      console.log(`file written successfully to ${filenameFullPath}`);
      return filenameFullPath;
    } catch (err) {
      console.error(`cannot write to file ${filenameFullPath}. Error: ${err}`);
    }
  }

  /***************************************/
  /* END I/O FUNCTIONS TO THE FILESYSTEM */

  /***************************************/

  /**
   * Used by the V1 version of user-agents.
   */
  #getRanomisedUserAgentV1() {
    const userAgents = new UserAgents({
      deviceCategory: "desktop",
      platform: "MacIntel", //"Linux x86_64",
      vendor: "Google Inc.",
    });
    return userAgents.random();
  }

  // #getRanomisedUserAgentV0() {
  //   const userAgents = require("user-agents");
  //   return userAgents.random();
  // }

  getRanomisedUserAgent() {
    return this.#getRanomisedUserAgentV1();
  }
}

export const helper = new Helper();
