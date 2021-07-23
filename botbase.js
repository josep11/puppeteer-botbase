
class BotBase {
    page = null;

    async initialize() {
        console.log('init bot base v0.0.3');
        this.page = 1;
    }

    async isLoggedIn() {
        console.log(`page = ${this.page}`);
    }
}

module.exports = BotBase;