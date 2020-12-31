class ConnectionError extends Error {
  constructor (params) {
    super(params)

    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(params)).stack
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }

    // Custom debugging information
    this.data = null
    this.date = new Date()
    this.statusCode = null
  }

  setStatusCode (code) {
    this.statusCode = code
  }

  setData (data) {
    this.data = data
  }
}

export default ConnectionError
