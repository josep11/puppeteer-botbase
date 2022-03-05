/* global it, describe  */
const chromium = require('chrome-aws-lambda');
const { shouldTestBotBase } = require('./botbase.shared');
const puppeteer = chromium.puppeteer;
const BotBase = require('../botbase')(puppeteer);

const path = require('path');
const projectRoot = path.resolve(__dirname, '../');

describe('Botbase AWS Tests', () => {

    shouldTestBotBase({ puppeteer, BotBase, projectRoot });

});