const path = require("path");

const { promises: fs } = require("fs");
const { exec: execAsync } = require("child-process-async");
const util = require("util");
const moment = require("moment");
const userAgents = require("user-agents");

class Helper {
	constructor() {
		/**
		 * @param {number} in miliseconds
		 * @returns {function}
		 */
		this.delay = util.promisify(setTimeout);
	}

	printDate(channel = console.log) {
		// console.log('---------------------------------------');
		channel("----------" + this.getNow() + "----------");
		// console.log('---------------------------------------');
	}

	dateFormatForLog() {
		// TODO: move to luxon
		return moment(new Date()).format("yyyy-MM-DD_HH.mm.ss");
	}

	consoleListener(message) {
		const type = message.type().substr(0, 3).toUpperCase();
		if (type == "WAR" || type == "INF") {
			return;
		}
		console.info(`${type} ${message.text()}`);
	}

	/**
	 * @param milliseconds - the number of milliseconds to wait.
	 */
	async waitForTimeout(milliseconds) {
		await new Promise((r) => setTimeout(r, milliseconds));
	}

	/**
	 * This function gets the difference in hours from the param with the actual moment
	 * @param {Date} pastTime
	 */
	getDiferenceInHours(pastTime) {
		const now = moment(); // get "now" as a moment
		const momentStart = moment(pastTime);
		return moment.duration(now.diff(momentStart)).asHours();
	}

	/**
	 * Returns date in format YYYY-MM-DD = 2021-10-30
	 */
	getDate() {
		return moment().format("yyyy-MM-DD");
	}

	getNow() {
		return moment().format();
	}

	getNowMinus(hoursAgo = 0) {
		return moment().subtract(hoursAgo, "hours").format();
	}

	getRandBetween(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	mapAsync(array, callbackfn) {
		return Promise.all(array.map(callbackfn));
	}

	/**
	 *
	 * @param {array} array array to filter
	 * @param {function} callbackfn should be a function that returns a Promise
	 * @returns
	 */
	async filterAsync(array, callbackfn) {
		const filterMap = await this.mapAsync(array, callbackfn);
		return array.filter((value, index) => filterMap[index]);
	}

	async textExistsInPage(page, text) {
		const found = await page.$x(`//*[contains(., "${text}")]`);
		return found.length > 0;
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
	 * @returns Number
	 */
	extractHorasFromString(timeStr) {
		// 23 horas
		if (!timeStr) return null;

		if (timeStr.indexOf("hora") != -1) {
			const horas = timeStr.match(/\d+/)[0];

			return parseInt(horas);
		} else {
			if (timeStr.indexOf("seg") != -1 || timeStr.indexOf("min") != -1) {
				return 0;
			}
			if (timeStr.indexOf("día") != -1) {
				return 25;
			}
			throw `FIXME: Helper.extractHorasFromString: En la string the time no se encontró 'hora'. Input timeStr = ${timeStr}`;
		}
	}

	async getIp() {
		const { stdout, stderr } = await execAsync(`curl checkip.amazonaws.com`);
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
		const ip_file = path.resolve(basePath, "./logs/ip.txt");
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
		const nBytes = await fs.appendFile(filename, text, "utf-8");
		return nBytes;
	}

	/**
	 *
	 * @param {string} filename
	 * @returns {string} the content of the file
	 */
	async readFile(filename) {
		return await fs.readFile(filename, "utf-8");
	}

	async emptyFile(filename) {
		return await this.writeFile(filename, "");
	}

	async readJsonFile(cookiesFile) {
		try {
			const myJsonObject = require(cookiesFile);
			return myJsonObject;
		} catch (err) {
			console.error("Reading cookie error. Defaulting to [] \n\n" + err);
			return [];
		}
	}

	createDirIfNotExists(dir) {
		const fs = require("fs");

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
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
			if (err.code == "ENOENT") {
				// console.error(`The file ${file} does not exist`);
			} else {
				throw err;
			}
		}
	}

	async logJSONdebug(jsonStr, basePath = __dirname) {
		const dir = path.resolve(basePath, `./logs/dataset`);
		this.createDirIfNotExists(dir);
		const filenameFullPath = path.resolve(
			dir,
			`data_${this.dateFormatForLog()}.json`
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
	 * This function is deprecated with the RenewManager no need to run this function in the browser context
	 * @param {*} timeStr
	 * @param {*} HOURS_NEED_TO_RENEW
	 */
	needToRenew(timeStr, HOURS_NEED_TO_RENEW) {
		if (timeStr.indexOf("min") != -1 || timeStr.indexOf("seg") != -1) {
			return false;
		}
		if (timeStr.indexOf("día") != -1) {
			return true;
		}
		if (timeStr.indexOf("horas") != -1) {
			const horas = timeStr.match(/\d+/)[0];
			if (horas >= HOURS_NEED_TO_RENEW) {
				return true;
			}
		} else {
			console.error(
				"FIXME: En la string the time no se encontró ni 'min', 'seg', 'día', 'hora'"
			);
		}
		return false;
	}

	/**
	 *
	 */
	getRanomisedUserAgent() {
		return userAgents.random({
			deviceCategory: "desktop",
			platform: "MacIntel", //"Linux x86_64",
			vendor: "Google Inc.",
		});
	}
}

module.exports = new Helper();
