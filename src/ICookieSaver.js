import { NotImplementedError } from "./custom_errors.js";

export class ICookieSaver {
  constructor() {
  }

  /**
   * @param {*} cookies
   */
  // eslint-disable-next-line require-await
  async writeCookies(cookies) {
    if (!cookies) {
      throw new Error("Developer fix this: unexistent param");
    }
    throw new NotImplementedError("not implemented");
  }

  /**
   * @returns {Promise<*>}
   */
  // eslint-disable-next-line require-await
  async readCookies() {
    throw new NotImplementedError("not implemented");
  }

  /**
   * When extending it, should save "[]" as empty cookie
   */
  // eslint-disable-next-line require-await
  async removeCookies() {
    throw new NotImplementedError("not implemented");
  }
}
