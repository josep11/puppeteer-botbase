const {
  LoginError,
  MyTimeoutError,
  NoInternetError,
  NotImplementedError,
  HTMLMarkupChangedError,
} = require("./src/custom_errors");

const HelperPuppeteer = require("./src/helper_puppeteer");
const helper = require("./src/helper");
const ICookieSaver = require("./src/ICookieSaver");
const IScreenshotSaver = require("./src/IScreenshotSaver");
const LocalFsCookieSaver = require("./src/LocalFsCookieSaver");
const LocalScreenshotSaver = require("./src/LocalScreenshotSaver");

module.exports = {
  // BotBaseFactory
  BotBaseFactory: require("./src/botbase-factory"),

  // Errors
  LoginError,
  MyTimeoutError,
  NoInternetError,
  NotImplementedError,
  HTMLMarkupChangedError,

  // Helper Puppeteer
  HelperPuppeteer,

  // Helper
  helper,

  // Savers
  ICookieSaver,
  IScreenshotSaver,
  LocalFsCookieSaver,
  LocalScreenshotSaver,
};
