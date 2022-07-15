const assert = require('assert');
const S3CookieSaver = require('../S3CookieSaver');
let cookieSaver;

// the bucket name where to perform tests
const S3_BUCKET_NAME = 'botsdatasam';
const output_filename = 'MyDummyBot.json';

describe('S3CookieSaver Tests', () => {
/* 
    it('should intantiate it', () => {
        cookieSaver = new S3CookieSaver({ S3_BUCKET_NAME, output_filename });
        assert.ok(cookieSaver);
    });

    it('should throw an error on constructor because of first param type style', () => {
        assert.throws(() => {
            new S3CookieSaver();
        }, 'constructor param is not there');
    })

    it('should throw on instantiation', () => {

        assert.throws(() => {
            new S3CookieSaver(5);
        }, 'constructor not checking param type parameter');

    });

    it('should get empty cookies', async () => {

        await assertEmptyCookies();
    });

    it('should write cookies', async () => {

        await cookieSaver.writeCookies([{ 'e': 1 }]);

        let cookies = await cookieSaver.readCookies();
        // assert.doesNotThrow(async () => { })
        assert.strictEqual(cookies.length, 1);
        assert.strictEqual(cookies[0].e, 1);

    });

    async function assertEmptyCookies() {
        const cookies = await cookieSaver.readCookies();
        assert(Array.isArray(cookies));
        assert.strictEqual(cookies.length, 0);
    }

    it('should remove cookies', async () => {

        try {
            await cookieSaver.removeCookies();
        } catch (err) {
            assert.fail('didnt throw');
        }
        await assertEmptyCookies();
    });
 */

});