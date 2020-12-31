/* global fetch, FormData */
import ConnectionError from './ConnectionError'
import Mime from 'mime/lite'
import QueryString from 'qs'

export class Connection {
  baseUrl: String
  headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  constructor (baseUrl: String) {
    this.baseUrl = baseUrl
  }

  get = (path, params) => {
    if (params) {
      path += '?' + QueryString.stringify(params)
    }
    return this._doRequest('GET', path)
  }

  delete = (path) => {
    return this._doRequest('DELETE', path)
  }

  post = (path, data) => {
    return this._doRequest('POST', path, JSON.stringify(data))
  }

  put = (path, data) => {
    return this._doRequest('PUT', path, JSON.stringify(data))
  }

  /**
   * @param {string} path
   * @param {string} name Name of the form field
   * @param {object} file Result from Expo ImagePicker/ImageManipulator
   */
  postFile = (path, name, file) => {
    let uriParts = file.uri.split('.')
    let fileType = uriParts[uriParts.length - 1]

    let formData = new FormData()
    formData.append(name, {
      ...file,
      name: `photo.${fileType}`,
      type: Mime.getType(fileType)
    })

    return this._doRequest('POST', path, formData, this.getHeaders({
      'Content-Type': 'multipart/form-data'
    }))
  }

  _doRequest = async (method: String, path: String, data = null, headers: ?Object = null) => {
    let url = this.baseUrl + '/' + path
    let requestHeaders = headers === null ? this.getHeaders() : headers

    // TODO: logger.info('Request:' + [method, url].join(' '), {
    //   data,
    //   requestHeaders
    // })

    try {
      var response = await fetch(url, {
        method: method,
        headers: requestHeaders,
        body: data
      })

      await this.validateResponse(response)

      // Return true if response contains no data
      // otherwise return data (async)
      var result = (response.status === 204 && !response.body)
        ? true
        : await response.json()
      return result
    } catch (error) {
      this.handleError(
        'Connection error',
        error,
        response?.status,
        result
      )
    }
  }

  validateResponse = async (res) => {
    if (!res.ok) {
      this.handleError(
        'Network error',
        await res.json(),
        res.status,
        res
      )
    }
  }

  /**
   * @param {string} message
   * @param {*} err
   * @param {integer} status
   *
   * @memberof Connection
   */
  handleError = (message, err, status, result) => {
    // REVIEW: Do not catch own error
    if (err instanceof ConnectionError) {
      throw err
    }
    let error = new ConnectionError(message)
    error.setData({
      error: err,
      response: {
        status: status,
        body: result
      }
    })

    this._logError({
      message: message,
      data: error.data
    })
    throw error
  }

  /**
   * @param {Object} [override={}] Object of headers to merge/overwrite defaults
   * @returns
   * @memberof Connection
   */
  getHeaders (override: Object = {}) {
    return { ...this.headers, ...override }
  }

  /**
   * Set default headers for all requests
   *
   * @param {Object} headers
   * @memberof Connection
   */
  addHeaders (headers: Object) {
    this.headers = { ...this.headers, ...headers }
  }

  _logError = (data) => {
    // TODO: logger.warn('Connection error', data)
  }
}
