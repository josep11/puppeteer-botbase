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
exports.ScreenshotSaver = void 0;
const path_1 = require("path");
const helper_1 = require("../helper");
const fs_1 = require("fs");
class ScreenshotSaver {
    constructor(screenshotBasepath) {
        if (!screenshotBasepath) {
            throw new Error("screenshotBasepath parameter not defined");
        }
        this.screenshotBasepath = screenshotBasepath;
        this.allowedTypes = ["jpg", "jpeg", "png"];
        //check that the screenshotBasepath exists or create it
        helper_1.helper.createDirIfNotExists((0, path_1.dirname)(this.screenshotBasepath));
    }
    _checkType(type) {
        if (!type) {
            throw new Error("type is not defined");
        }
        if (this.allowedTypes.indexOf(type) === -1) {
            throw new Error(`Type "${type}" not allowed.`);
        }
    }
    // eslint-disable-next-line require-await
    saveScreenshot(imageBuffer, type, filename = "default") {
        return __awaiter(this, void 0, void 0, function* () {
            //check for errors
            this._checkType(type);
            const screenshotLocation = `${this.screenshotBasepath}/${helper_1.helper.dateFormatForLog()}_${filename}.${type}`;
            // console.log(`Saving screenshot "${filename}" at ${screenshotLocation}`);
            (0, fs_1.writeFileSync)(screenshotLocation, imageBuffer);
            return screenshotLocation;
        });
    }
}
exports.ScreenshotSaver = ScreenshotSaver;
