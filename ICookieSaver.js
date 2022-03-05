const { NotImplementedError } = require('./custom_errors');

class ICookieSaver {

    constructor() {

    }

    async readCookies() {
        throw new NotImplementedError('not implemented');
    }

    async writeCookies(){
        throw new NotImplementedError('not implemented');
    }
    
    /**
     * When extending it, should save "[]" as empty cookie
     */
    async removeCookies(){
        throw new NotImplementedError('not implemented');
    }

}

module.exports = ICookieSaver;