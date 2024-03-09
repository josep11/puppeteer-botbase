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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserLauncher = void 0;
class BrowserLauncher {
    constructor(puppeteer) {
        this.puppeteer = puppeteer;
    }
    /**
     * @param {Object} options - Options for launching the browser
     * @param {string?} [chromiumExecutablePath] - Path to chromium executable
     * @returns {Promise<Browser>}
     */
    launch(options, chromiumExecutablePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chromiumExecutablePath) {
                options = Object.assign(Object.assign({}, options), { executablePath: chromiumExecutablePath });
            }
            return yield this.puppeteer.launch(options);
        });
    }
}
exports.BrowserLauncher = BrowserLauncher;
