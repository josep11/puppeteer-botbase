/* global it, describe  */
const assert = require('assert');
const chromium = require('chrome-aws-lambda');
const puppeteer = chromium.puppeteer;
const BotBase = require('../botbase')(puppeteer);
const { shouldTestBotbase } = require('./shared/botbase.shared');

describe('Botbase AWS Tests', () => {

    shouldTestBotbase({ puppeteer, BotBase });

});