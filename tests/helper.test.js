import assert from "assert";
import { expect } from "chai";
import fs, { promises as pfs } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { helper } from "../index.js";

describe("Module Helper Tests", () => {
  let filePath;

  // This will run after each test in the "Module Helper Tests" block
  afterEach(async function () {
    if (fs.existsSync(filePath)) {
      await pfs.unlink(filePath); // Delete file
    }
  });

  it("should filter async", async () => {
    const arr = [1, 2, 3, 4];

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

  it("should be 0 hours difference", () => {
    const res = helper.getDiferenceInHours(helper.getNow());
    assert.strictEqual(Math.round(res), 0);
  });
  it("should be 15 hours difference", () => {
    const d = new Date();
    d.setHours(d.getHours() - 15);
    assert.strictEqual(Math.round(helper.getDiferenceInHours(d)), 15);
  });
  it("should be 24 hours difference", () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    assert.strictEqual(Math.round(helper.getDiferenceInHours(d)), 24);
  });

  it("should test getNowMinus: substract hours", () => {
    const hours = 1;
    const nowMinusMom = helper.getNowMinus(hours);
    assert.strictEqual(
      Math.round(helper.getDiferenceInHours(nowMinusMom)),
      hours,
    );
  });

  it("should get the ip address", async () => {
    let ip = await helper.getIp();
    // console.log(`ip: ${ip}`);

    assert.ok(ip);
    assert.match(
      ip,
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    );
  });

  it("should wait 10ms", async () => {
    // noinspection JSCheckFunctionSignatures
    await helper.delay(10);
  });

  it("should get randomised user agent", () => {
    const ua = helper.getRanomisedUserAgent();
    expect(ua).to.be.a.string;
  });

  it('dateFormatForLog: should return date in the format "yyyy-MM-DD_HH.mm.ss"', function () {
    const result = helper.dateFormatForLog();

    const date = new Date();
    const pad = (n) => (n < 10 ? "0" + n : n);

    let expectedFormat =
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "_" +
      pad(date.getHours()) +
      "." +
      pad(date.getMinutes()) +
      "." +
      pad(date.getSeconds());

    expect(result).to.equal(expectedFormat);
  });

  it("should read file content", async () => {
    // Setup: create a temporary file for testing
    const folderPath = tmpdir();
    filePath = join(folderPath, "test.txt");

    const expectedContent = "Hello, world!";
    await pfs.writeFile(filePath, expectedContent, { encoding: "utf-8" });

    const fileContent = await helper.readFile(filePath);

    expect(fileContent).to.equal(expectedContent);
  });

  it("should write the ip address to a file", async () => {
    const folderPath = tmpdir();
    filePath = join(folderPath, "test.txt");

    const ip = "0.0.0.0";
    await helper.writeIPToFile(ip, helper.dateFormatForLog(), filePath);

    const expectedContentToContain = `IP: ${ip}`;

    const fileContent = await helper.readFile(filePath);

    expect(fileContent).to.contain(expectedContentToContain);
  });
});
