"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLMarkupChangedError = exports.NoInternetError = exports.NotImplementedError = exports.MyTimeoutError = exports.LoginError = void 0;
class LoginError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}
exports.LoginError = LoginError;
class MyTimeoutError extends Error {
    constructor(message = "Conexió Lenta ❌") {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}
exports.MyTimeoutError = MyTimeoutError;
class NotImplementedError extends Error {
    constructor(message = "Method not implemented") {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}
exports.NotImplementedError = NotImplementedError;
class NoInternetError extends Error {
    constructor(message = "No Tens Internet ❌") {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}
exports.NoInternetError = NoInternetError;
class HTMLMarkupChangedError extends Error {
    constructor(message = "Markup: The page HTML changed. Need to fix it") {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}
exports.HTMLMarkupChangedError = HTMLMarkupChangedError;
