const assert = require('assert');
const {helper} = require('../index');
const expect = require("chai").expect;

describe('Module Helper Tests', () => {

    it('should filter async', async () => {
        var arr = [1, 2, 3, 4];

        function isThreeAsync(number) {
            return new Promise((res) => {
                setTimeout(() => {
                    res(number === 3);
                }, 1);
            });
        }

        const filteredArr = await helper.filterAsync(arr, isThreeAsync);
        assert.strictEqual(filteredArr.length, 1);
        assert.strictEqual(filteredArr[0], 3);
    });

    it('should be 0 hours difference', () => {
        const res = helper.getDiferenceInHours(helper.getNow());
        assert.strictEqual(Math.round(res), 0);
    });
    it('should be 15 hours difference', () => {
        var d = new Date();
        d.setHours(d.getHours() - 15);
        assert.strictEqual(Math.round(helper.getDiferenceInHours(d)), 15);
    });
    it('should be 24 hours difference', () => {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        assert.strictEqual(Math.round(helper.getDiferenceInHours(d)), 24);
    });

    it('should test getNowMinus: substract hours', () => {
        const hours = 1;
        const nowMinusMom = (helper.getNowMinus(hours));
        assert.strictEqual(Math.round(helper.getDiferenceInHours(nowMinusMom)), hours);
    });

    it('should get the ip address', async () => {
        let ip = await helper.getIp();
        // console.log(`ip: ${ip}`);

        assert.ok(ip);
        assert.match(ip, /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)

    });

    it('should write the ip address to a file', async () => {
        let resp = await helper.writeIPToFile('0.0.0.0', helper.dateFormatForLog());

        expect(resp).to.be.undefined;
    });

    it('should wait 10ms', async () => {
        await helper.delay(10);
    });

    it('should get randomised user agent', () => {
        const ua = helper.getRanomisedUserAgent();
        expect(ua).to.be.a.string;
    });

    it('dateFormatForLog: should return date in the format "yyyy-MM-DD_HH.mm.ss"', function() {
        const result = helper.dateFormatForLog();

        const date = new Date();
        const pad = (n) => n < 10 ? '0' + n : n;

        let expectedFormat = date.getFullYear() + "-"
          + pad(date.getMonth() + 1) + "-"
          + pad(date.getDate()) + "_"
          + pad(date.getHours()) + "."
          + pad(date.getMinutes()) + "."
          + pad(date.getSeconds());

        expect(result).to.equal(expectedFormat);
    });
});
