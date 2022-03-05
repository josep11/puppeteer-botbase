/* global it, describe  */
const assert = require('assert');
const puppeteer = require('puppeteer');
const BotBase = require('../botbase')(puppeteer);
const { shouldTestBotbase } = require('./shared/botbase.shared');

describe('Botbase Tests', () => {

    // before(function() {
    //     this.user = new User('tobi', 'holowaychuk');
    //   })

    shouldTestBotbase({ puppeteer, BotBase });

});