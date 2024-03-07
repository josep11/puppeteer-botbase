var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { dirname } from "path";
import { helper } from "../helper";
import { writeFileSync } from "fs";
export class ScreenshotSaver {
    constructor(screenshotBasepath) {
        if (!screenshotBasepath) {
            throw new Error("screenshotBasepath parameter not defined");
        }
        this.screenshotBasepath = screenshotBasepath;
        this.allowedTypes = ["jpg", "jpeg", "png"];
        //check that the screenshotBasepath exists or create it
        helper.createDirIfNotExists(dirname(this.screenshotBasepath));
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
            const screenshotLocation = `${this.screenshotBasepath}/${helper.dateFormatForLog()}_${filename}.${type}`;
            // console.log(`Saving screenshot "${filename}" at ${screenshotLocation}`);
            writeFileSync(screenshotLocation, imageBuffer);
            return screenshotLocation;
        });
    }
}
