/// <reference types="node" />
import { PathLike } from "fs";
declare class Helper {
    delay: (millis: number) => Promise<void>;
    constructor();
    printDate(channel?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    dateFormatForLog(): string;
    consoleListener(message: {
        type: () => string;
        text: () => any;
    }): void;
    /**
     * @param {number} milliseconds - the number of milliseconds to wait.
     */
    waitForTimeout(milliseconds: number): Promise<void>;
    /**
     * This function calculates the difference in hours between the pastTime parameter and the current datetime.
     * @param {string | Date} pastTime - The past time to compare with the current datetime. It can be either a string in ISO 8601 format or a Date object.
     * @return {number} - The difference in hours between the pastTime and the current datetime.
     */
    getDiferenceInHours(pastTime: string | Date): number;
    /**
     * Returns date in format YYYY-MM-DD = 2021-10-30
     */
    getDate(): string;
    /**
     * @return {string} The ISO formatted string representation of now
     */
    getNow(): string;
    /**
     * Returns the ISO formatted string representation of the current date and time
     * minus the specified number of hours.
     *
     * @param {number} [hoursAgo=0] - The number of hours to subtract from the current date and time.
     * @return {string} The ISO formatted string representation of the current date and time
     * minus the specified number of hours.
     */
    getNowMinus(hoursAgo?: number): string;
    /**
     * @param {number} hours
     * @return {number} milliseconds
     */
    hoursToMillis(hours: number): number;
    getRandBetween(min: number, max: number): number;
    /**
     * @param array
     * @param callbackfn
     */
    mapAsync<T, R>(array: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<R>): Promise<R[]>;
    /**
     *
     * @param array array to filter
     * @param callbackfn  should be a function that returns a Promise
     * @returns
     */
    filterAsync<T>(array: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<any>): Promise<T[]>;
    /**
     *
     * @param {string} text
     * @param {string} textToFind
     * @returns {number}
     */
    countStringOccurrences(text: string, textToFind: string | RegExp): number;
    /**
     *
     * @param {string} timeStr
     * @returns {number|null}
     */
    extractHorasFromString(timeStr: string): number | null;
    getIp(): Promise<string>;
    /*****************************************/
    /*****************************************/
    /**
     * @param {string} ip
     * @param {string} date
     * @param {PathLike} ipFilePath the file where to save it
     */
    writeIPToFile(ip: string, date: string, ipFilePath: PathLike): Promise<void>;
    /**
     *
     * @param {string} filename
     * @param {string} content
     */
    writeFile(filename: string, content: string): Promise<void>;
    /**
     * Will write the text to the filename. Newlines should be explicitly set.
     * @param {string} filename filename to write to
     * @param {string} text text to write
     * @returns
     */
    appendFile(filename: string, text: string): Promise<void>;
    /**
     * @param {string} filename
     * @returns {Promise<string>} the content of the file
     */
    readFile(filename: string): Promise<string>;
    emptyFile(filename: string): Promise<void>;
    /**
     * @param {string} filePath - The path to the JSON file to load.
     * @return {object} the parsed JSON object.
     * @throws {SyntaxError} when the JSON is malformed
     */
    loadJson(filePath: string): object;
    createDirIfNotExists(dir: string): void;
    rmFileIfExists(file: string): Promise<void>;
    /**
     * @param {string} jsonStr
     * @param basePath
     */
    logJSONdebug(jsonStr: string, basePath?: string): Promise<string>;
    /***************************************/
    /***************************************/
    /**
     * Used by the V1 version of user-agents.
     */
    protected getRanomisedUserAgentV1(): string;
    getRanomisedUserAgent(): string;
}
export declare const helper: Helper;
export {};
