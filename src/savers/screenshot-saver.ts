import { dirname } from "path";

import { ScreenshotSaverInterface } from "./screenshot-saver-interface";
import { helper } from "../helper";
import { writeFileSync } from "fs";

export class ScreenshotSaver implements ScreenshotSaverInterface {
  private readonly screenshotBasepath: string;

  private allowedTypes: string[];

  constructor(screenshotBasepath: string) {
    if (!screenshotBasepath) {
      throw new Error("screenshotBasepath parameter not defined");
    }

    this.screenshotBasepath = screenshotBasepath;
    this.allowedTypes = ["jpg", "jpeg", "png"];

    //check that the screenshotBasepath exists or create it
    helper.createDirIfNotExists(dirname(this.screenshotBasepath));
  }

  _checkType(type: string) {
    if (!type) {
      throw new Error("type is not defined");
    }
    if (this.allowedTypes.indexOf(type) === -1) {
      throw new Error(`Type "${type}" not allowed.`);
    }
  }

  // eslint-disable-next-line require-await
  async saveScreenshot(
    imageBuffer: Buffer,
    type: string,
    filename = "default"
  ) {
    //check for errors
    this._checkType(type);

    const screenshotLocation = `${this.screenshotBasepath}/${helper.dateFormatForLog()}_${filename}.${type}`;
    // console.log(`Saving screenshot "${filename}" at ${screenshotLocation}`);
    writeFileSync(screenshotLocation, imageBuffer);
    return screenshotLocation;
  }
}
