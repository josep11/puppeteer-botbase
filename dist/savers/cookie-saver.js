"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieSaver = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const helper_1 = require("../helper");
class CookieSaver {
    constructor(cookiesFilePath) {
        this.cookiesFilePath = cookiesFilePath;
        if (!cookiesFilePath.length) {
            throw new Error("cookiesFilePath is invalid");
        }
        helper_1.helper.createDirIfNotExists((0, path_1.dirname)(this.cookiesFilePath));
    }
    /**
     *
     * @returns {Promise<object[]>}
     */
    // eslint-disable-next-line require-await
    readCookies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cookies = helper_1.helper.loadJson(this.cookiesFilePath);
                // Check if cookies is an array
                if (!(cookies instanceof Array)) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error("cookies is not an array");
                }
                // Check if all elements in the array are objects
                for (const cookie of cookies) {
                    if (typeof cookie !== "object") {
                        // noinspection ExceptionCaughtLocallyJS
                        throw new Error("Array contains non-object elements");
                    }
                }
            }
            catch (err) {
                if (err.code !== "ENOENT") {
                    console.error("Reading cookie error. Defaulting to [] \n\n" + err);
                }
            }
            return [];
        });
    }
    // eslint-disable-next-line require-await
    writeCookies(cookies) {
        return __awaiter(this, void 0, void 0, function* () {
            let cookiesText;
            if (typeof cookies === "object") {
                cookiesText = JSON.stringify(cookies, null, 2);
            }
            else {
                cookiesText = cookies;
            }
            fs_1.default.writeFileSync(this.cookiesFilePath, cookiesText);
        });
    }
    /**
     * When extending it, should save "[]" as empty cookie
     */
    removeCookies() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeCookies("[]");
        });
    }
}
exports.CookieSaver = CookieSaver;
