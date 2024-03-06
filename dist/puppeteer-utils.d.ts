import { CookieParam, Page } from "puppeteer";
export declare function semiRandomiseViewPort(page: Page, width: number, height: number): Promise<void>;
export declare function objectToCookieParam(obj: object): CookieParam;
export declare function objectArrayToCookieParamArray(cookies: object[]): CookieParam[];
