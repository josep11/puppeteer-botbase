import { CookieSaverInterface } from "./cookie-saver-interface";
export declare class CookieSaver implements CookieSaverInterface {
    private readonly cookiesFilePath;
    constructor(cookiesFilePath: string);
    /**
     *
     * @returns {Promise<object[]>}
     */
    readCookies(): Promise<object[]>;
    writeCookies(cookies: object | string): Promise<void>;
    /**
     * When extending it, should save "[]" as empty cookie
     */
    removeCookies(): Promise<void>;
}
