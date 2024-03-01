import HelperPuppeteer from "./src/helper_puppeteer";

import {
  HTMLMarkupChangedError,
  LoginError,
  MyTimeoutError,
  NoInternetError,
  NotImplementedError,
} from "./src/custom_errors";

import helper from "./src/helper";

import IScreenshotSaver from "./src/IScreenshotSaver";

import ICookieSaver from "./src/ICookieSaver";

import LocalFsCookieSaver from "./src/LocalFsCookieSaver";

import LocalScreenshotSaver from "./src/LocalScreenshotSaver";

import BotBaseFactory from "./src/botbase-factory";

module.exports = {
  // BotBaseFactory
  BotBaseFactory,

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
