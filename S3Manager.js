const AWS = require('aws-sdk');
const s3 = new AWS.S3()

class S3Manager {

    constructor(S3_BUCKET_NAME) {
        this.S3_BUCKET_NAME = S3_BUCKET_NAME;
    }

    async saveJson(key, json) {
        let text = json;
        if (typeof json == "object") {
            text = JSON.stringify(json);
        }

        if (!key || typeof key != "string") {
            throw new Error('Developer fix this: key parameter is undefined or not string');
        }

        const s3Params = {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
            Body: text,
            ContentEncoding: 'utf-8',
            ContentType: 'application/json',
            // ServerSideEncryption: 'AES256'
        }

        await s3.putObject(s3Params).promise()
    }

    /**
     * 
     * @returns {object} returns the json object or array from the s3 bucket
     */
    async getJson(key) {
        const params = {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
        };

        try {
            const file = await s3.getObject(params).promise();
            const data = file.Body;
            return JSON.parse(data);
        } catch (err) {
            if (err.code == 'NoSuchKey') {
                console.error('json not found');
                return [];
            }
            console.error(err);
            throw err;
        }
    }

    async deleteObject(key) {
        const params = {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
        };

        await s3.deleteObject(params).promise();
    }

    async saveImage(key, imageBuffer) {
        // console.log('\n\nScreenshot taken (in memory)\n\n')

        // key = `screenshots/${output_filename}`;

        const s3Params = {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
            Body: imageBuffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            ServerSideEncryption: 'AES256'
        }

        await s3.putObject(s3Params).promise()
    }

}

module.exports = S3Manager;
