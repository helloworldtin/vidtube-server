class APIResponse {
  success: boolean;
  constructor(public statusCode: number, public data: object, public message = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400
  }
}

export default APIResponse;