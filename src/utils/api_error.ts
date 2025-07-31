class APIError extends Error {
  data: string | null;
  success: boolean;
  constructor(public statusCode: number, public message = "something went wrong", public errors = [], public stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = this.errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default APIError;