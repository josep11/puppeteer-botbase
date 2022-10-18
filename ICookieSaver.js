const { NotImplementedError } = require("./custom_errors");

class ICookieSaver {
	constructor() {}

	/**
	 * @param {*} cookies
	 */
	async writeCookies(cookies) {
		if (!cookiesJson) {
			throw new Error("Developer fix this: unexistent param");
		}
		throw new NotImplementedError("not implemented");
	}

	/**
	 * @returns {Promise<*>}
	 */
	async readCookies() {
		throw new NotImplementedError("not implemented");
	}

	/**
	 * When extending it, should save "[]" as empty cookie
	 */
	async removeCookies() {
		throw new NotImplementedError("not implemented");
	}
}

module.exports = ICookieSaver;
