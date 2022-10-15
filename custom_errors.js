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

class NoInternetError extends Error {

    constructor(message = 'No Tens Internet ❌') {
        super(message)
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name
    }

}

class HTMLMarkupChangedError extends Error {

    constructor(message = 'Markup: The page HTML changed. Need to fix it') {
        super(message)
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name
    }

}

module.exports = {
    LoginError,
    MyTimeoutError,
    NoInternetError,
    NotImplementedError,
    HTMLMarkupChangedError
}