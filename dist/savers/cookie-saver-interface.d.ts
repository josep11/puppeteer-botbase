export interface CookieSaverInterface {
    writeCookies(cookies: object | string): Promise<void>;
    /**
     * @returns {Promise<object[]>}
     */
    readCookies(): Promise<object[]>;
    /**
     * When extending it, should save "[]" as empty cookie
     */
    removeCookies(): Promise<void>;
}
