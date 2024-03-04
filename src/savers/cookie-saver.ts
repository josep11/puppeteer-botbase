import fs from "fs";
import { dirname } from "path";

import { helper } from "../helper";
import { CookieSaverInterface } from "./cookie-saver-interface";

export class CookieSaver implements CookieSaverInterface {
  private readonly cookiesFilePath: string;

  constructor(cookiesFilePath: string) {
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
      return helper.loadJson(this.cookiesFilePath);
    } catch (err: any) {
      if (err.code !== "ENOENT") {
        console.error("Reading cookie error. Defaulting to [] \n\n" + err);
      }
    }
    return [];
  }

  // eslint-disable-next-line require-await
  async writeCookies(cookies: object | string): Promise<void> {
    let cookiesText: string;
    if (typeof cookies === "object") {
      cookiesText = JSON.stringify(cookies, null, 2);
    } else {
      cookiesText = cookies;
    }

    fs.writeFileSync(this.cookiesFilePath, cookiesText);
  }

  /**
   * When extending it, should save "[]" as empty cookie
   */
  async removeCookies() {
    await this.writeCookies("[]");
  }
}
