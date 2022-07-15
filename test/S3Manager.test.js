const { assert } = require("chai");
const S3Manager = require("../S3Manager");

const S3_BUCKET_NAME = 'botsdatasam';

describe('S3Manager Tests', () => {
/* 
    it('should throw on unexistent bucket', async () => {

        const s3Manager = new S3Manager('dummyyy');

        try {
            await s3Manager.checkBucketExists();
            assert.fail('didnt throw');
        } catch (err) {
            const a = 1;
        }

    });

    it('should test bucket exists', async () => {

        const s3Manager = new S3Manager(S3_BUCKET_NAME);

        try {
            await s3Manager.checkBucketExists();
        } catch (err) {
            console.error(err);
            assert.fail('didnt find bucket');
        }

    }); 
    */
});