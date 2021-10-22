class LoginError extends Error {
    constructor(message) {
        super(message)
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name
    }
}

class MyTimeoutError extends Error {
    constructor(message = 'Conexió Lenta ❌') {
        super(message)
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name
    }
}

class NotImplementedError extends Error {
    constructor(message = 'Method not implemented') {
        super(message)
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name
    }
}

module.exports = {
    LoginError,
    MyTimeoutError,
    NotImplementedError
}