const { dirname } = require("path");
const fs = require("fs");
const helper = require("./helper");
const IScreenshotSaver = require("./IScreenshotSaver");

class LocalScreenshotSaver extends IScreenshotSaver {
  constructor({ screenshotBasepath }) {
    super();
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
    if (this.allowedTypes.indexOf(type) == -1) {
      throw new Error(`Type ${type} not allowed.`);
    }
  }

  // eslint-disable-next-line require-await
  async saveScreenshot({ imageBuffer, filename = "default", type }) {
    //check for errors
    this._checkParams(imageBuffer);
    this._checkType(type);

    const screenshotLocation = `${this.screenshotBasepath}/${helper.dateFormatForLog()}_${filename}.${type}`;
    console.log(`Saving screenshot "${filename}" at ${screenshotLocation}`);
    fs.writeFileSync(screenshotLocation, imageBuffer);
    return screenshotLocation;
  }
}

module.exports = LocalScreenshotSaver;
