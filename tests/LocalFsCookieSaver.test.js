const assert = require("assert");
// var expect = require("chai").expect;
const path = require("path");
const fs = require("fs");
const LocalFsCookieSaver = require("../LocalFsCookieSaver");
const { rmFileIfExists } = require("../helper");
let cookieSaver;

const basePath = path.join(__dirname, "../");
const cookiesFilePath = path.resolve(basePath, "./res/cookies_test.json");

before(async () => {
	await rmFileIfExists(cookiesFilePath);
});

describe("LocalFsCookieSaver Tests", () => {
	it("should intantiate LocalFsCookieSaver", () => {
		cookieSaver = new LocalFsCookieSaver({ cookiesFilePath });
		assert.ok(cookieSaver);
	});

	it("should throw an error on constructor because of first param type style", () => {
		assert.throws(() => {
			new LocalFsCookieSaver();
		}, "constructor param is not there");
	});

	it("should throw on instantiation BotBase", () => {
		assert.throws(() => {
			new LocalFsCookieSaver(5);
		}, "constructor not checking param type parameter");
	});

	it("should write cookies", async () => {
		try {
			await cookieSaver.writeCookies([{ e: 1 }]);
		} catch (err) {
			console.error(err);
			assert.fail("exception saving cookies");
		}

		assert.strictEqual(fs.existsSync(cookiesFilePath), true);
	});
	/* 
        it('should fail writing cookies', async () => {
    
            try {
                await cookieSaver.writeCookies('{t:5}');
            } catch (err) {
                err == 0;
                return;
            }
            assert.fail('didnt throw');
    
        });
     */
	it("should read cookies", async () => {
		assert.doesNotThrow(async () => {
			await cookieSaver.readCookies();
		});
	});

	it("should read cookies", async () => {
		// TODO: doesNotThrow, I think it does not throw but has some unexpected behaviors
		assert.doesNotThrow(async () => {
			await cookieSaver.removeCookies();
		});
	});
});
