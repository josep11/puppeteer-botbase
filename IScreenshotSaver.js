const { NotImplementedError } = require('./custom_errors');

class IScreenshotSaver {

    constructor() {

    }

    _checkParams(imageBuffer) {
        if (!imageBuffer) {
            throw new Error('Developer fix this: imageBuffer unexistent param');
        }
        if (!(imageBuffer instanceof Buffer)) {
            throw new Error('imageBuffer is not of type Buffer');
        }
    }

    /**
     * 
     * @param {Object} param0 
     * @returns {Promise<string>} the place where the image is stored
     */
    async saveScreenshot({ imageBuffer, filename }) {
        this._checkParams(imageBuffer);
        throw new NotImplementedError('not implemented');
    }

}

module.exports = IScreenshotSaver;