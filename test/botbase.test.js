// eslint-disable-next-line no-unused-vars
/* global it, describe  */
const puppeteer = require('puppeteer');
const { shouldTestBotBase } = require('./botbase.shared');
const BotBase = require('../botbase')(puppeteer);

const path = require('path');
const basePath = path.resolve(__dirname, '../');

describe('Botbase Tests', () => {

    shouldTestBotBase({ puppeteer, BotBase, basePath });

});