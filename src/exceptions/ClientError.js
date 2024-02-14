class ClientError extends Error {
  constructor(messge, statusCode = 400) {
    super(messge);
    this.statusCode = statusCode;
    this.name = "Client Error";
  }
}

module.exports = ClientError;
