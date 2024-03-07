import fs from "fs";
import { glob } from "glob";
import { resolve } from "path";
import puppeteer from "puppeteer";

// Application-specific modules
import { BotBase, BrowserLauncher, CookieSaver, ScreenshotSaver } from "../src";
import BotBaseParams from "../src/types/BotBaseParams";

const mainUrl = "https://sampleurl.com";

// const __dirname = dirname(import.meta.url);
const basePath = resolve(__dirname, "../");

const browserLauncher = new BrowserLauncher(puppeteer);

const cookieSaver = new CookieSaver(resolve(basePath, "./res/cookies.json"));
const screenshotSaver = new ScreenshotSaver(resolve(basePath, "./screenshots"));

function buildBotBaseParams(
  mainUrl: string,
  basePath: string,
  configChild: object = {}
) {
  return new BotBaseParams(
    mainUrl,
    basePath,
    cookieSaver,
    screenshotSaver,
    browserLauncher,
    configChild
  );
}

class ExampleChild extends BotBase {
  constructor(basePath: string) {
    const configChild = {
      settings: {
        enabled: false,
      },
    };
    super(buildBotBaseParams("https://dummy.com", basePath, configChild));
  }
}

describe("Botbase Tests", () => {
  let botbase: BotBase | null = null;

  it("should intantiate BotBase", () => {
    const botBaseParams = buildBotBaseParams(mainUrl, basePath);
    botbase = new BotBase(botBaseParams);
    expect(botbase).toBeTruthy();
  });

  it("should get enabled true as default option", () => {
    expect(botbase).toBeTruthy();
    const enabled = botbase?.enabled();
    expect(enabled).toBeTruthy();
  });

  it("should get enabled false as default option for child class", () => {
    const myChildCls = new ExampleChild("example/base/path");
    const enabled = myChildCls.enabled();
    expect(enabled).toEqual(false);
  });

  it("should override default config properties", () => {
    const myChildCls = new ExampleChild("example/base/path");
    const config = myChildCls.getConfig();
    try {
      expect(config).toBeTruthy();
      expect(config.settings).toBeTruthy();
      expect(config.settings.width).toBeTruthy();
    } catch (e) {
      throw new Error(
        "it didnt override config properties rather deconste the previous ones"
      );
    }
  });

  it("should get the version", () => {
    expect(botbase).toBeTruthy();
    const version = botbase?.getVersion();
    expect(version?.length).toBeGreaterThanOrEqual(3);
  });

  it("should call successfully initialise", async () => {
    expect(botbase).toBeTruthy();
    await botbase?.initialize();
  });

  it("should log ip to text file", async () => {
    expect(botbase).toBeTruthy();
    await botbase?.logIP();
  });

  it("should get a sample website with puppeteer", async () => {
    expect(botbase).toBeTruthy();
    await botbase?.initialize({
      headless: "new",
      devtools: false,
      ignoreHTTPSErrors: true,
      // slowMo: 50,
      // args: ['--disable-gpu', '--no-sandbox', '--no-zygote', '--disable-setuid-sandbox', '--disable-accelerated-2d-canvas', '--disable-dev-shm-usage', "--proxy-server='direct://'", "--proxy-bypass-list=*"]
    });
    expect(botbase?.page).toBeTruthy();
    await botbase?.page?.goto("https://bot.sannysoft.com", {
      waitUntil: "networkidle2",
    });
  });

  it("should take a screenshot with puppeteer", async () => {
    // Configure botbase
    const mainUrl = "https://google.com";
    const botBaseParams = new BotBaseParams(
      mainUrl,
      basePath,
      cookieSaver,
      screenshotSaver,
      browserLauncher,
      {}
    );
    let botbase = new BotBase(botBaseParams);

    let screenshotPath;
    await botbase?.initialize();
    expect(botbase?.page).toBeTruthy();
    await botbase?.page?.goto(mainUrl, { waitUntil: "domcontentloaded" });
    try {
      screenshotPath = await botbase?.takeScreenshot("tests");
      expect(typeof screenshotPath).toEqual("string");
    } catch (err: any) {
      console.error(err);
      // eslint-disable-next-line no-undef
      fail("screenshot not successful");
    } finally {
      await botbase?.shutDown();
    }

    try {
      fs.statSync(screenshotPath);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        // eslint-disable-next-line no-undef
        fail(`The file "${screenshotPath}" does not exist`);
      } else {
        throw err;
      }
    }
  });

  // clean up screenshot tests
  afterAll(async () => {
    //list files in screenshot directory
    const imgExtGlobFilter = "*(*.png|*.jpeg|*.jpg)";
    const screenshotGlobFilter = `${basePath}/screenshots/${imgExtGlobFilter}`;
    const results = glob.sync(screenshotGlobFilter);
    for (const file of results) {
      // console.log(`cleaning up ${file}`);
      fs.unlinkSync(file);
    }
    await botbase?.shutDown();
  });
});
