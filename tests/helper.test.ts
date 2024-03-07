import { existsSync, PathLike, promises as pfs } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { helper } from "../src";

describe("Module Helper Tests", () => {
  let filePath: PathLike;

  afterEach(async function () {
    if (existsSync(filePath)) {
      await pfs.unlink(filePath);
    }
  });

  it("should filter async", async () => {
    const arr = [1, 2, 3, 4];

    function isThreeAsync(number: number) {
      return new Promise((res) => {
        setTimeout(() => {
          res(number === 3);
        }, 1);
      });
    }

    const filteredArr = await helper.filterAsync(arr, isThreeAsync);
    expect(Array.isArray(filteredArr)).toBe(true);
    expect(filteredArr).toHaveLength(1);
    expect(filteredArr[0]).toEqual(3);
  });

  it("should be 0 hours difference", () => {
    const res = helper.getDiferenceInHours(helper.getNow());
    expect(Math.round(res)).toEqual(0);
  });

  it("should be 15 hours difference", () => {
    const d = new Date();
    d.setHours(d.getHours() - 15);
    expect(Math.round(helper.getDiferenceInHours(d))).toEqual(15);
  });

  it("should be 24 hours difference", () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    expect(Math.round(helper.getDiferenceInHours(d))).toEqual(24);
  });

  it("should test getNowMinus: substract hours", () => {
    const hours = 1;
    const nowMinusMom = helper.getNowMinus(hours);
    expect(Math.round(helper.getDiferenceInHours(nowMinusMom))).toEqual(hours);
  });

  it("should get the ip address", async () => {
    const ip = await helper.getIp();
    expect(ip).toBeDefined();
    expect(ip).toMatch(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    );
  });

  it("should wait 10ms", async () => {
    await helper.delay(10);
  });

  it("should get randomised user agent", () => {
    const ua = helper.getRanomisedUserAgent();
    expect(typeof ua).toEqual("string");
  });

  it('dateFormatForLog: should return date in the format "yyyy-MM-DD_HH.mm.ss"', function () {
    const result = helper.dateFormatForLog();

    const date = new Date();
    const pad = (n: number) => (n < 10 ? "0" + n : n);

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

    expect(result).toEqual(expectedFormat);
  });

  it("should read file content", async () => {
    // Setup: create a temporary file for testing
    const folderPath = tmpdir();
    filePath = join(folderPath, "test.txt");

    const expectedContent = "Hello, world!";
    await pfs.writeFile(filePath, expectedContent, { encoding: "utf-8" });

    const fileContent = await helper.readFile(filePath);

    expect(fileContent).toEqual(expectedContent);
  });

  it("should write the ip address to a file", async () => {
    const folderPath = tmpdir();
    filePath = join(folderPath, "test.txt");

    const ip = "0.0.0.0";
    await helper.writeIPToFile(ip, helper.dateFormatForLog(), filePath);

    const expectedContentToContain = `IP: ${ip}`;

    const fileContent = await helper.readFile(filePath);

    expect(fileContent).toContain(expectedContentToContain);
  });
});
