const { dirname } = require('path');
const fs = require('fs');
const helper = require('./helper');
const IScreenshotSaver = require('./IScreenshotSaver');
const { createDirIfNotExists } = require('./helper');

class LocalScreenshotSaver extends IScreenshotSaver {

    constructor({ screenshotBasepath }) {
        super();
        if (!screenshotBasepath) {
            throw new Error('screenshotBasepath parameter not defined');
        }
        
        this.screenshotBasepath = screenshotBasepath;
        this.allowedTypes = ['jpg', 'jpeg', 'png'];

        //check that the screenshotBasepath exists or create it
        helper.createDirIfNotExists(dirname(this.screenshotBasepath))
    }

    _checkType(type) {
        if (this.allowedTypes.indexOf(type) == -1) {
            throw new Error(`Type ${type} not allowed.`);
        }
    }

    async saveScreenshot({ imageBuffer, filename = '', type }) {
        //check for errors
        this._checkParams(imageBuffer);
        this._checkType(type);

        const screenshotLocation = `${this.screenshotBasepath}/${helper.dateFormatForLog()}_${filename}.${type}`;
        console.log(`Saving screenshot ${filename} at ${screenshotLocation}`);
        fs.writeFileSync(screenshotLocation, imageBuffer);
        return screenshotLocation;
    }

}

module.exports = LocalScreenshotSaver;