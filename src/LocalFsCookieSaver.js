const fs = require("fs");
const { dirname } = require("path");
const helper = require("./helper");
const ICookieSaver = require("./ICookieSaver");

class LocalFsCookieSaver extends ICookieSaver {
  /**
   *
   * @param {Object} param should have the following keys { cookiesFilePath }
   */
  constructor({ cookiesFilePath }) {
    super();
    if (!cookiesFilePath || typeof cookiesFilePath != "string") {
      throw new Error(
        "Developer fix this: cookiesFilePath is undefined or not string"
      );
    }

    this.cookiesFilePath = cookiesFilePath;

    helper.createDirIfNotExists(dirname(this.cookiesFilePath));
  }

  /**
   *
   * @returns {Promise<*>}
   */
  // eslint-disable-next-line require-await
  async readCookies() {
    try {
      const jsonString = fs.readFileSync(this.cookiesFilePath);
      return JSON.parse(jsonString.toString());
    } catch (err) {
      if (err.code != "ENOENT") {
        console.error("Reading cookie error. Defaulting to [] \n\n" + err);
      }
    }
    return [];
  }

  /**
   * @param {*} cookies
   */
  // eslint-disable-next-line require-await
  async writeCookies(cookies) {
    let cookiesText = cookies;
    if (typeof cookies == "object") {
      cookiesText = JSON.stringify(cookies, null, 2);
    }
    return fs.writeFileSync(this.cookiesFilePath, cookiesText);
  }

  /**
   * When extending it, should save "[]" as empty cookie
   */
  async removeCookies() {
    await this.writeCookies("[]");
  }
}

module.exports = LocalFsCookieSaver;
