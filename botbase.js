const helper = require('./src/helper');

class BotBase {
    page = null;

    async initialize() {
        console.log('init bot base v0.0.3');
        this.page = 1;
    }

    async isLoggedIn() {
        console.log(`page = ${this.page}`);
    }

    async logIP() {
        await this.page.goto('http://checkip.amazonaws.com/');
        let current_ip_address = await this.page.evaluate(() => document.body.textContent.trim());
        await helper.writeIPToFile(current_ip_address, helper.dateFormatForLog());
        console.log(current_ip_address);
        return current_ip_address
    }
}

module.exports = BotBase;