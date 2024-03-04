export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
  }
}

export class MyTimeoutError extends Error {
  constructor(message = "Conexió Lenta ❌") {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
  }
}

export class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
  }
}

export class NoInternetError extends Error {
  constructor(message = "No Tens Internet ❌") {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
  }
}

export class HTMLMarkupChangedError extends Error {
  constructor(message = "Markup: The page HTML changed. Need to fix it") {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
  }
}
