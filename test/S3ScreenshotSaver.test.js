const assert = require('assert');
const { readFileSync } = require('fs');
const path = require('path');
const S3Manager = require('../S3Manager');
const S3ScreenshotSaver = require('../S3ScreenshotSaver');
let screenshotSaver;

// the bucket name where to perform tests
const S3_BUCKET_NAME = 'botsdatasam';
const botName = 'MyDummyBot';

const pathToImage = path.resolve(__dirname, './test-resources/example.png');

const s3Manager = new S3Manager(S3_BUCKET_NAME);

describe('S3ScreenshotSaver Tests', () => {

    it('should intantiate it', () => {
        screenshotSaver = new S3ScreenshotSaver({
            botName,
            S3_BUCKET_NAME
        })
        assert.ok(screenshotSaver);
    });

    it('should throw an error on constructor because of first param type style', () => {
        assert.throws(() => {
            new S3ScreenshotSaver({});
        }, 'constructor param is not there');
    })

    it('should throw on instantiation', () => {

        assert.throws(() => {
            new S3ScreenshotSaver({ botName });
        }, 'constructor not checking param type parameter');

    });

    it('should get false as object exists', async () => {
        const key = 'dummyKey';
        const exists = await s3Manager.objectExists(key);
        assert.strictEqual(exists, false);
    });

    it('should save screenshot', async () => {

        var imgFile = readFileSync(pathToImage);
        // var imageBuffer = imgFile.toString("base64");
        const imageBuffer = Buffer.from(imgFile);
        const filename = 'example.png';
        const key = await screenshotSaver.saveScreenshot({ imageBuffer, filename })
        console.log('key: ', key);
        const exists = await s3Manager.objectExists(key);
        assert.strictEqual(exists, true);
        // assert.strictEqual(cookies.length, 1);
        // assert.strictEqual(cookies[0].e, 1);

    });

});