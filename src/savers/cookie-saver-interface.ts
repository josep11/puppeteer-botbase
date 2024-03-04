export interface CookieSaverInterface {
  // eslint-disable-next-line no-unused-vars
  writeCookies(cookies: object | string): Promise<void>;

  /**
   * @returns {Promise<*>}
   */
  readCookies(): Promise<any>;

  /**
   * When extending it, should save "[]" as empty cookie
   */
  removeCookies(): Promise<void>;
}
