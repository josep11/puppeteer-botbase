// Node.js built-in modules
import assert from "assert";
import fs from "fs";
import path from "path";

// Third-party libraries
import puppeteer from "puppeteer";
// Application-specific modules
import { BotBase, BrowserLauncher, CookieSaver, ScreenshotSaver } from "../index";
import { glob } from "glob";
import { CookieSaverInterface } from "../src/savers/cookie-saver-interface";
import { ScreenshotSaverInterface } from "../src/savers/screenshot-saver-interface";
import BotBaseParams from "../src/types/BotBaseParams";
import { expect } from "chai";

const shouldTestBotBase = (
  basePath: string,
  cookieSaver: CookieSaverInterface,
  screenshotSaver: ScreenshotSaverInterface,
  browserLauncher: BrowserLauncher,
) => {

  function builBotBaseParams(
    mainUrl: string,
    basePath: string,
    configChild: object = {},
  ) {
    return new BotBaseParams(
      mainUrl,
      basePath,
      cookieSaver,
      screenshotSaver,
      browserLauncher,
      configChild,
    );
  }

  class ExampleChild extends BotBase {
    constructor(basePath: string) {
      const configChild = {
        settings: {
          enabled: false,
        },
      };
      super(builBotBaseParams("https://dummy.com", basePath, configChild));
    }
  }

  let botbase: BotBase | null = null;
  const mainUrl = "https://sampleurl.com";

  it("should intantiate BotBase", () => {
    const botBaseParams = builBotBaseParams(mainUrl, basePath);
    botbase = new BotBase(botBaseParams);
    assert.ok(botbase);
  });

  it("should get enabled true as default option", () => {
    assert.ok(botbase);
    const enabled = botbase.enabled();
    assert.ok(enabled);
  });

  it("should get enabled false as default option for child class", () => {
    const myChildCls = new ExampleChild("example/base/path");
    const enabled = myChildCls.enabled();
    assert.strictEqual(false, enabled);
  });

  it("should override default config properties", () => {
    const myChildCls = new ExampleChild("example/base/path");
    const config = myChildCls.getConfig();
    const errMsg =
      "it didnt override config properties rather deconste the previous ones";
    assert.ok(config, errMsg);
    assert.ok(config.settings, errMsg);
    assert.ok(config.settings.width, errMsg);
  });

  it("should call successfully initialise", async () => {
    assert.ok(botbase);
    await botbase.initialize();
  });

  it("should log ip to text file", async () => {
    assert.ok(botbase);
    await botbase.logIP();
  });

  it("should get the version", () => {
    assert.ok(botbase);
    const version = botbase.getVersion();
    expect(version).to.have.lengthOf.at.least(3);
  });

  it("should get a sample website with puppeteer", async () => {
    assert.ok(botbase);
    await botbase.initialize({
      headless: "new",
      devtools: false,
      ignoreHTTPSErrors: true,
      // slowMo: 50,
      // args: ['--disable-gpu', '--no-sandbox', '--no-zygote', '--disable-setuid-sandbox', '--disable-accelerated-2d-canvas', '--disable-dev-shm-usage', "--proxy-server='direct://'", "--proxy-bypass-list=*"]
    });

    assert.ok(botbase.page);
    await botbase.page.goto("https://bot.sannysoft.com", {
      waitUntil: "networkidle2",
    });
  });

  // clean up screenshot tests
  afterAll(() => {
    //list files in screenshot directory
    const imgExtGlobFilter = "*(*.png|*.jpeg|*.jpg)";
    const screenshotGlobFilter = `${basePath}/screenshots/${imgExtGlobFilter}`;
    const results = glob.sync(screenshotGlobFilter);
    for (const file of results) {
      // console.log(`cleaning up ${file}`);
      fs.unlinkSync(file);
    }
  });
};


// const __dirname = dirname(import.meta.url);
const basePath = path.resolve(__dirname, "../");

const browserLauncher = new BrowserLauncher(puppeteer);

const cookieSaver = new CookieSaver(
  path.resolve(basePath, "./res/cookies.json"),
);
const screenshotSaver = new ScreenshotSaver(
  path.resolve(basePath, "./screenshots"),
);

describe("Botbase Tests", () => {
  shouldTestBotBase(
    basePath,
    cookieSaver,
    screenshotSaver,
    browserLauncher,
  );

  it("should take a screenshot with puppeteer", async () => {
    const mainUrl = "https://google.com";
    const botBaseParams = new BotBaseParams(
      mainUrl,
      basePath,
      cookieSaver,
      screenshotSaver,
      browserLauncher,
      {},
    );
    const botbase = new BotBase(botBaseParams);
    let screenshotPath;
    await botbase.initialize();
    await botbase.page?.goto(mainUrl, { waitUntil: "networkidle2" });
    try {
      screenshotPath = await botbase.takeScreenshot("tests");
      assert.equal(typeof screenshotPath, "string");
    } catch (err: any) {
      console.error(err);
      assert.fail("screenshot not successful");
    }

    try {
      fs.statSync(screenshotPath);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        assert.fail(`The file "${screenshotPath}" does not exist`);
      } else {
        throw err;
      }
    }
  });
});
