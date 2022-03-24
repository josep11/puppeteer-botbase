const ICookieSaver = require('./ICookieSaver');
const S3Manager = require('./S3Manager');

class S3CookieSaver extends ICookieSaver {
    /**
     * 
     * @param {obj} param should have the following keys { dirKeyCookies, S3_BUCKET_NAME, output_filename  }
     */
    constructor({ dirKeyCookies = 'cookies', S3_BUCKET_NAME, output_filename }) {
        super();
        if (!S3_BUCKET_NAME || typeof S3_BUCKET_NAME != "string") {
            throw new Error('Developer fix this: S3_BUCKET_NAME parameter is undefined or not string');
        }
        if (!output_filename || typeof output_filename != "string") {
            throw new Error('Developer fix this: output_filename parameter is undefined or not string. It should be the botName');
        }

        if (output_filename.indexOf('.json') === -1) {
            output_filename = `${output_filename}.json`;
            console.log(`output_filename renamed to ${output_filename}`);
        }
        // this.dirKeyCookies = dirKeyCookies;
        this.s3Manager = new S3Manager(S3_BUCKET_NAME);
        this.key = `${dirKeyCookies}/${output_filename}`
    }

    async readCookies() {
        try {
            return await this.s3Manager.getJson(this.key);
        } catch (err) {
            console.error("Reading cookie error. Defaulting to [] \n\n" + err)
            return [];
        }
    }

    /**
     * 
     * @param {*} cookiesJson can be a string or an object
     * @returns 
     */
    async writeCookies(cookiesJson) {
        return await this.s3Manager.saveJson(this.key, cookiesJson);
    }

    /**
     * 
     */
    async removeCookies() {
        return await this.s3Manager.deleteObject(this.key);
    }

}

module.exports = S3CookieSaver;