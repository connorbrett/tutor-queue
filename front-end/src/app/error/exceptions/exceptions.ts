export class ThrottleError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'Request Throttled';
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'Unauthorized';
  }
}

export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'Bad Request';
  }
}
