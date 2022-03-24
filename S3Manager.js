const AWS = require('aws-sdk');
const s3 = new AWS.S3()

class S3Manager {

    constructor(S3_BUCKET_NAME) {
        if (!S3_BUCKET_NAME || typeof S3_BUCKET_NAME != "string") {
            throw new Error('Developer fix this: S3_BUCKET_NAME parameter is undefined or not string');
        }
        this.S3_BUCKET_NAME = S3_BUCKET_NAME;
    }

    async checkBucketExists() {
        try {
            await s3.headBucket({ Bucket: this.S3_BUCKET_NAME }).promise()
            //   console.log `Bucket "${this.S3_BUCKET_NAME}" exists`
        } catch (err) {
            if (err.statusCode === 403) {
                throw `Bucket "${this.S3_BUCKET_NAME}" Access Denied`
            }

            if (err.statusCode >= 400 && err.statusCode < 500) {
                throw `Bucket "${this.S3_BUCKET_NAME}" Not Found`
            }

            throw err
        }
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

    async objectExists(key) {
        const params = {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
        };

        try {
            await s3.getObject(params).promise();
            // TODO: maybe check body if some problem crops up
            return true;
        } catch (err) {
            if (err.name === 'NotFound') {
                console.error(err.name);
                return false;
            }
            if (err.code == 'NoSuchKey') {
                return false;
            }

            console.error('another error', err);
        }

        return false;

    }

    async deleteObject(key) {
        const params = {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
        };

        await s3.deleteObject(params).promise();
    }

    async saveImage(key, imageBuffer) {
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
