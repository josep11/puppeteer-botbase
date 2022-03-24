const IScreenshotSaver = require('./IScreenshotSaver');
const S3Manager = require('./S3Manager');

class S3ScreenshotSaver extends IScreenshotSaver {

    /**
     * 
     * @param {obj} param should have the following keys { botName, S3_BUCKET_NAME, output_filename  }
     */
    constructor({ botName, S3_BUCKET_NAME }) {
        super();
        if (!S3_BUCKET_NAME || typeof S3_BUCKET_NAME != "string") {
            throw new Error('Developer fix this: S3_BUCKET_NAME parameter is undefined or not string');
        }
        if (!botName) {
            throw new Error('botName parameter not defined');
        }

        this.allowedTypes = ['jpg', 'jpeg', 'png'];
        this.s3Manager = new S3Manager(S3_BUCKET_NAME);
        this.screenshotBasepath = `screenshots/${botName}`;
    }

    _checkType(type) {
        if (!type) {
            throw new Error('type is not defined');
        }
        if (this.allowedTypes.indexOf(type) == -1) {
            throw new Error(`Type ${type} not allowed.`);
        }
    }

    async saveScreenshot({ imageBuffer, filename = 'default', type }) {
        //check for errors
        this._checkParams(imageBuffer, type);
        if (!type) {
            type = filename.split('.').pop();
        }
        console.log(type);
        this._checkType(type);

        if (filename.indexOf(type) === -1) {
            filename = `${filename}.${type}`;
            console.log(`output_filename renamed to "${filename}"`);
        }

        const key = `${this.screenshotBasepath}/${filename}`;

        await this.s3Manager.saveImage(key, imageBuffer);
        return key;
    }

}

module.exports = S3ScreenshotSaver;