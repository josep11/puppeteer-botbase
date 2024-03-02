// eslint-disable-next-line no-unused-vars
import assert from "assert";
import fs from "fs";
import { glob } from "glob";
// import path from "path";

export const shouldTestBotBase = ({
                                    BotBase,
                                    basePath,
                                    cookieSaver,
                                    screenshotSaver,
                                  }) => {
  class ExampleChild extends BotBase {
    constructor({ basePath }) {
      super({
        mainUrl: "http://dummy.com",
        basePath,
        cookieSaver,
        screenshotSaver,
        configChild: {
          settings: {
            enabled: false,
          },
        },
      });
    }
  }

  let botbase = null;
  const mainUrl = "http://sampleurl.com";

  it("should intantiate BotBase", () => {
    botbase = new BotBase({
      mainUrl,
      basePath,
      cookieSaver,
      screenshotSaver,
    });
    assert.ok(botbase);
  });

  it("should get enabled true as default option", () => {
    const enabled = botbase.enabled();
    assert.ok(enabled);
  });

  it("should get enabled false as default option for child class", () => {
    const myChildCls = new ExampleChild({
      basePath: "example/base/path",
    });
    const enabled = myChildCls.enabled();
    assert.strictEqual(false, enabled);
  });

  it("should override default config properties", () => {
    const myChildCls = new ExampleChild({
      basePath: "example/base/path",
    });
    const config = myChildCls.getConfig();
    const errMsg =
      "it didnt override config properties rather deconste the previous ones";
    assert.ok(config, errMsg);
    assert.ok(config.settings, errMsg);
    assert.ok(config.settings.width, errMsg);
  });

  // This is not needed anymore
  // it('should throw an error on constructor because of first param type style', () => {
  //     const mainUrl = 'http://google.com';
  //     assert.throws(() => {
  //         new BotBase({
  //             mainUrl,
  //             basePath,
  //         });
  //     }, 'botbase constructor param is wrong');
  // })

  it("should throw on instantiation BotBase", () => {
    const mainUrl = {};

    assert.throws(() => {
      new BotBase({
        mainUrl,
        basePath,
        cookieSaver,
        screenshotSaver,
      });
    }, "botbase constructor not checking mainUrl type parameter");
  });

  it("should call successfully initialise", async () => {
    await botbase.initialize();
  });

  it("should log ip to text file", async () => {
    await botbase.logIP();
  });

  it("should get a sample website with puppeteer", async () => {
    await botbase.initialize({
      headless: "new",
      devtools: false,
      ignoreHTTPSErrors: true,
      // slowMo: 50,
      // args: ['--disable-gpu', '--no-sandbox', '--no-zygote', '--disable-setuid-sandbox', '--disable-accelerated-2d-canvas', '--disable-dev-shm-usage', "--proxy-server='direct://'", "--proxy-bypass-list=*"]
    });

    await botbase.page.goto("https://bot.sannysoft.com", {
      waitUntil: "networkidle2",
    });
  });

  // clean up screenshot tests
  after(() => {
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
